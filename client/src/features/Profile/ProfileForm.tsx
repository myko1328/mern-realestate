import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/user/userSlice";
import { ProfileFormProp } from "./types";

const ProfileForm = (prop: ProfileFormProp) => {
  const {
    formData,
    fileUploadError,
    filePerc,
    setUpdateSuccess,
    handleChange,
    setFile,
  } = prop;
  const fileRef = useRef<any>(null);
  const dispatch = useDispatch();

  const { currentUser, loading } = useSelector(
    (state: RootState) => state.user
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/v1/user/update/${currentUser?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error: any) {
      console.log({ error });
      dispatch(updateUserFailure(error?.message));
    }
  };
  return (
    <form className="flex flex-col gap-4">
      <input
        //@ts-ignore
        onChange={(e) => setFile(e.target.files[0])}
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
      />

      <img
        onClick={() => fileRef.current.click()}
        src={formData.avatar || currentUser?.avatar}
        alt="profile"
        className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
      />

      <p className="text-sm self-center">
        {fileUploadError ? (
          <span className="text-red-700">
            Error Image upload (image must be less than 2 mb)
          </span>
        ) : filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
        ) : filePerc === 100 ? (
          <span className="text-green-700">Image successfully uploaded!</span>
        ) : (
          ""
        )}
      </p>

      <input
        type="text"
        placeholder="username"
        defaultValue={currentUser?.username}
        id="username"
        className="border p-3 rounded-lg"
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="email"
        id="email"
        defaultValue={currentUser?.email}
        className="border p-3 rounded-lg"
        onChange={handleChange}
      />
      <input
        type="password"
        placeholder="password"
        onChange={handleChange}
        id="password"
        className="border p-3 rounded-lg"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
      >
        {loading ? "Loading..." : "Update"}
      </button>

      <Link
        className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
        to={"/create-listing"}
      >
        Create Listing
      </Link>
    </form>
  );
};

export default ProfileForm;
