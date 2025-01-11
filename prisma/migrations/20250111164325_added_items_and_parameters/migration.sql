/*
  Warnings:

  - A unique constraint covering the columns `[employee_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employee_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `employee_id` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('OPERATOR', 'ADMIN', 'DEVELOPER') NOT NULL DEFAULT 'OPERATOR';

-- CreateTable
CREATE TABLE `MeasurementItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MeasurementItem_id_item_key`(`id_item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Parameter` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` VARCHAR(191) NOT NULL,
    `tool_name` VARCHAR(191) NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `minValue` DOUBLE NOT NULL,
    `maxValue` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `employee_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Item_id_item_key`(`id_item`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParameterValue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_item` VARCHAR(191) NOT NULL,
    `id_parameter` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_employee_id_key` ON `User`(`employee_id`);

-- AddForeignKey
ALTER TABLE `Parameter` ADD CONSTRAINT `Parameter_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `MeasurementItem`(`id_item`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `MeasurementItem`(`id_item`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParameterValue` ADD CONSTRAINT `ParameterValue_id_item_fkey` FOREIGN KEY (`id_item`) REFERENCES `Item`(`id_item`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParameterValue` ADD CONSTRAINT `ParameterValue_id_parameter_fkey` FOREIGN KEY (`id_parameter`) REFERENCES `Parameter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
