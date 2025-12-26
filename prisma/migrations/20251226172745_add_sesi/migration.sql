/*
  Warnings:

  - You are about to drop the column `role_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role_id",
ADD COLUMN     "role" VARCHAR(20) NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "sesi" (
    "id" SERIAL NOT NULL,
    "ruangan_id" INTEGER NOT NULL,
    "nama_sesi" TEXT NOT NULL,
    "jam_mulai" TEXT NOT NULL,
    "jam_selesai" TEXT NOT NULL,

    CONSTRAINT "sesi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sesi" ADD CONSTRAINT "sesi_ruangan_id_fkey" FOREIGN KEY ("ruangan_id") REFERENCES "ruangan"("ruangan_id") ON DELETE CASCADE ON UPDATE CASCADE;
