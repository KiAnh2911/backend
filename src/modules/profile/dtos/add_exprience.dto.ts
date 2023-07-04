import { IsNotEmpty } from "class-validator";

class AddExperienceDto {
  @IsNotEmpty()
  public title: string | undefined;
  @IsNotEmpty()
  public company: string | undefined;
  @IsNotEmpty()
  public location: string | undefined;
  @IsNotEmpty()
  public from: Date | undefined;
  @IsNotEmpty()
  public to: Date | undefined;
  @IsNotEmpty()
  public current: boolean | undefined;
  @IsNotEmpty()
  public description: string | undefined;
}
export default AddExperienceDto;
