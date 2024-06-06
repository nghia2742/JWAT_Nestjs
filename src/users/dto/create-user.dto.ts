import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    fullname: string;

    @IsNotEmpty()
    role: string;
    
    @IsNotEmpty()
    @IsArray()
    @IsString({each: true})
    project: string[];

    activeYn: string = 'Y';
}
