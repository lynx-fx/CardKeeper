import { ApiProperty, PartialType } from "@nestjs/swagger";
import { WarrantyType } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsEmail, IsNumber, IsString, IsStrongPassword } from "class-validator";


export class CardDto {
    productName!: string;
    brand!: string;
    category!: string;
    @Transform(({ value }) => value.toISOString())
    purchaseDate!: string;
    @Transform(({ value }) => value.toISOString())
    warrantyExpiry!: string;
    purchasePrice!: number;
    store!: string;
    serialNumber!: string;
    warrantyType!: WarrantyType;
    description!: string;
    imageUri!: string;
}

export class CreateCardDto {
    @ApiProperty()
    @IsString()
    productName!: string;

    @ApiProperty()
    @IsString()
    brand!: string;

    @ApiProperty()
    @IsString()
    category!: string;

    @ApiProperty()
    @IsDateString()
    purchaseDate!: string;

    @ApiProperty()
    @IsDateString()
    warrantyExpiry!: string;

    @ApiProperty()
    @IsNumber()
    purchasePrice!: number;

    @ApiProperty()
    @IsString()
    store!: string;

    @ApiProperty()
    @IsString()
    serialNumber!: string;

    @ApiProperty()
    @IsString()
    warrantyType!: WarrantyType;

    @ApiProperty()
    @IsString()
    description!: string;

    @ApiProperty()
    @IsString()
    imageUri!: string;


}

export class UpdateCardDto extends PartialType(CreateCardDto){ 
}

export class GetCardsResponseDto {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    cards!: CardDto[]
}

export class GetCardResponseDto {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    card!: CardDto
}


export class CreateCardResponseDto {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    message!: string
}

export class UpdateCardResponseDto {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    message!: string
}

export class DeleteCardResponseDto {
    @ApiProperty()
    success!: boolean;
    @ApiProperty()
    message!: string
}
