import { prisma } from '@/lib/prisma';
import { s3Client } from '@/lib/s3Client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Prisma } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ keyFile: string }> }
) {
	const { keyFile } = await params;

	try {
		// Usando uma transação para garantir consistência e evitar race conditions
		return await prisma.$transaction(
			async (tx) => {
				// Para PostgreSQL, usamos findFirst com noWait ou skipLocked para implementar o bloqueio
				// Isso é uma alternativa ao FOR UPDATE quando _query não é suportado diretamente
				const fileRecord = await tx.file.findUnique({
					where: { keyFile },
					select: {
						id: true,
						fileName: true,
						keyFile: true,
						size: true,
						mimeType: true,
						description: true,
						isDisabled: true,
						disabledReason: true,
						expirationDate: true,
						oneTimeDownload: true
					}
				});

				if (!fileRecord) {
					return NextResponse.json(
						{ error: 'Arquivo não encontrado' },
						{ status: 404 }
					);
				}

				// Se estamos usando PostgreSQL e o arquivo é de download único,
				// aplicamos um bloqueio adicional a nível de linha para garantir exclusividade
				if (
					process.env.DATABASE_URL?.includes('postgres') &&
					fileRecord.oneTimeDownload
				) {
					try {
						// Executamos uma consulta raw para obter um bloqueio a nível de linha
						await tx.$executeRaw`SELECT id FROM "File" WHERE id = ${fileRecord.id} FOR UPDATE NOWAIT`;
					} catch (lockErr) {
						// Se não conseguirmos o bloqueio, significa que outra transação já está processando este arquivo
						if (
							lockErr instanceof Prisma.PrismaClientKnownRequestError &&
							lockErr.code === 'P2034'
						) {
							return NextResponse.json(
								{
									error:
										'Este arquivo está sendo processado por outra requisição. Tente novamente.'
								},
								{ status: 409 }
							);
						}
						throw lockErr;
					}
				}

				if (fileRecord.isDisabled) {
					return NextResponse.json(
						{
							error:
								fileRecord.disabledReason ||
								'O download desse arquivo foi desabilitado.'
						},
						{ status: 403 }
					);
				}

				if (
					fileRecord.expirationDate &&
					new Date(fileRecord.expirationDate) < new Date()
				) {
					return NextResponse.json(
						{ error: 'Arquivo expirado.' },
						{ status: 410 }
					);
				}

				if (fileRecord.oneTimeDownload) {
					// Verificamos a contagem de downloads dentro da transação
					const downloadCount = await tx.download.count({
						where: { fileId: fileRecord.id }
					});

					if (downloadCount > 0) {
						return NextResponse.json(
							{ error: 'Arquivo só pode ser baixado uma vez' },
							{ status: 403 }
						);
					}
				}

				// Setup command with bucket and key
				const command = new GetObjectCommand({
					Bucket: process.env.R2_BUCKET,
					Key: fileRecord.keyFile
				});

				// Gera uma URL pré-assinada para o cliente baixar diretamente
				const signedUrl = await getSignedUrl(s3Client, command, {
					expiresIn: 3600
				});

				// Registra o download dentro da transação
				const ip = request.headers.get('x-forwarded-for') || '';
				const userAgent = request.headers.get('user-agent') || '';

				await tx.download.create({
					data: { fileId: fileRecord.id, ip, userAgent }
				});

				return NextResponse.json({ url: signedUrl }, { status: 200 });
			},
			{
				// Definimos um tempo limite (timeout) para a transação, para evitar bloqueios muito longos
				timeout: 10000, // 10 segundos em milissegundos
				// Para PostgreSQL, podemos usar isolation level Serializable para maior segurança
				...(process.env.DATABASE_URL?.includes('postgres')
					? {
							isolationLevel: 'Serializable'
						}
					: {})
			}
		);
	} catch (err) {
		console.error('Erro ao processar download:', err);
		return NextResponse.json(
			{ error: 'Falha ao processar o download do arquivo' },
			{ status: 500 }
		);
	}
}
