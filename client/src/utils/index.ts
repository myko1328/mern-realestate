export const StringToBoolean = (val: string) => {
  const stringBool: string = val;

  if (stringBool === "true") {
    return true;
  } else {
    return false;
  }
};
