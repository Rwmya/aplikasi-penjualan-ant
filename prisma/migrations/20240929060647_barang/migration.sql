/*
  Warnings:

  - You are about to drop the `katalog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `katalog`;

-- CreateTable
CREATE TABLE `Barang` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaBarang` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Barang_namaBarang_key`(`namaBarang`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
