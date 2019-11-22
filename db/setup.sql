-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema estadio-sonoro
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema estadio-sonoro
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `estadio-sonoro` DEFAULT CHARACTER SET utf8mb4 ;
USE `estadio-sonoro` ;

-- -----------------------------------------------------
-- Table `estadio-sonoro`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estadio-sonoro`.`user` (
  `idUser` INT(11) NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(96) NULL DEFAULT NULL,
  `email` VARCHAR(96) NULL DEFAULT NULL,
  `password` VARCHAR(196) NULL DEFAULT NULL,
  `facebookId` BIGINT(20) NULL DEFAULT NULL,
  `googleId` VARCHAR(64) NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `estadio-sonoro`.`record`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estadio-sonoro`.`record` (
  `idRecord` INT(11) NOT NULL AUTO_INCREMENT,
  `idUser` INT(11) NOT NULL,
  `fileName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idRecord`),
  INDEX `recordUser_idx` (`idUser` ASC),
  CONSTRAINT `recordUser`
    FOREIGN KEY (`idUser`)
    REFERENCES `estadio-sonoro`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `estadio-sonoro`.`users`
-- -----------------------------------------------------


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
