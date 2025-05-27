/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize } from 'class-validator';

export class CreateOnCallSwapDto {
  @IsNumber()
  @IsNotEmpty()
  solicitant_id: number; // requesterId

  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  lista_selectata: number[]; // Array of user IDs for potential replacements
}
