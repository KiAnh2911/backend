import { IsNotEmpty } from "class-validator";

class EducationDto {
  @IsNotEmpty()
  public school: string | undefined;
  @IsNotEmpty()
  public degree: string | undefined;
  @IsNotEmpty()
  public fieldofstudy: string | undefined;
  @IsNotEmpty()
  public from: Date | undefined;
  @IsNotEmpty()
  public to: Date | undefined;
  @IsNotEmpty()
  public current: boolean | undefined;
  @IsNotEmpty()
  public description: string | undefined;
}

export default EducationDto;
