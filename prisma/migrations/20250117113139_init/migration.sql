/*
  Warnings:

  - You are about to drop the column `tool_name` on the `parameter` table. All the data in the column will be lost.
  - Added the required column `id_tool` to the `Parameter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parameter` DROP COLUMN `tool_name`,
    ADD COLUMN `id_tool` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Tools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Parameter` ADD CONSTRAINT `Parameter_id_tool_fkey` FOREIGN KEY (`id_tool`) REFERENCES `Tools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
