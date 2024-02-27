export interface ProfileEditProp {
  email: string;
  password: string;
  username: string;
  avatar?: string;
}

export interface ProfileFormProp {
  formData: ProfileEditProp;
  fileUploadError: boolean;
  filePerc: number;
  setUpdateSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setFile: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}
