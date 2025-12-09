-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "nama_role" VARCHAR(50) NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "nim_nip" VARCHAR(50) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "no_telepon" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "ruangan" (
    "ruangan_id" SERIAL NOT NULL,
    "nama_ruangan" VARCHAR(100) NOT NULL,
    "lokasi" VARCHAR(100) NOT NULL,
    "kapasitas" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Tersedia',
    "ac" BOOLEAN NOT NULL DEFAULT false,
    "proyektor" BOOLEAN NOT NULL DEFAULT false,
    "papan_tulis" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ruangan_pkey" PRIMARY KEY ("ruangan_id")
);

-- CreateTable
CREATE TABLE "reservasi" (
    "reservasi_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ruangan_id" INTEGER NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "jam_mulai" TIME NOT NULL,
    "jam_selesai" TIME NOT NULL,
    "keperluan" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'Pending',
    "dokumen_path" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "reservasi_pkey" PRIMARY KEY ("reservasi_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nama_role_key" ON "roles"("nama_role");

-- CreateIndex
CREATE UNIQUE INDEX "users_nim_nip_key" ON "users"("nim_nip");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reservasi_ruangan_id_tanggal_mulai_jam_mulai_jam_selesai_key" ON "reservasi"("ruangan_id", "tanggal_mulai", "jam_mulai", "jam_selesai");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservasi" ADD CONSTRAINT "reservasi_ruangan_id_fkey" FOREIGN KEY ("ruangan_id") REFERENCES "ruangan"("ruangan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
