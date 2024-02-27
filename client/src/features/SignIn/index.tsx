import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { RootState } from "../../redux/store";
import OAuth from "../../components/OAuth";

const SignInView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state: RootState) => state.user);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));

        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error: any) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>

        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>

      <span className="text-red-700">{error}</span>
    </>
  );
};

export default SignInView;
