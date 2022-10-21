import React from "react";

function EditProfile({ closeModal }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#f8f4f4]">
      <div className="bg-[#BABABA] shadow-2xl w-[90%] h-[85%] flex flex-col items-center justify-center rounded-lg lg:mt-2 lg:h-[90%] lg:w-[60%]">
        <h1 className="font-bold">Edit Profile</h1>
        <div className="flex flex-col justify-center items-center gap-5">
          <img
            alt="user"
            className="w-[60%] md:w-[35%] lg:w-[30%]"
            src={require("../../assets/user.png")}
          />
          <h1>Name</h1>
          <hr className="w-64 mb-5" />
          <div className="w-[100%] flex flex-col gap-5 lg:flex lg:flex-row">
            <div className="flex flex-col items-center w-[100%] gap-5 lg:flex lg:items-end">
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className=" h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                required
                type="text"
                name="address"
                placeholder="Address"
                className=" h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex flex-col items-center w-[100%] gap-5 ">
              <input
                required
                type="tel"
                name="phone"
                placeholder="Contact Number"
                className=" h-10 pl-4 shadow appearance-none border-[1px] border-gray rounded w-[70%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <div className="flex justify-center items-center w-[95%] gap-2 lg:items-end">
                <select
                  name="gender"
                  id="gender"
                  className="h-10 pl-4 shadow border-[1px] border-gray rounded w-[35%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  className=" h-10 pl-4 shadow border-[1px] border-gray rounded w-[35%] py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                  type="text"
                  onFocus={(e) => (e.currentTarget.type = "date")}
                  onBlur={(e) => (e.currentTarget.type = "text")}
                  placeholder="Birthdate"
                  id="date"
                />
              </div>
              <div className="w-[100%] flex justify-end mr-24 gap-2">
                <button
                  onClick={() => closeModal(false)}
                  className="bg-white w-20 text-black font-bold py-2 px-4 rounded-3xl shadow-md hover:bg-maroon hover:text-white active:shadow-lg transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  onClick={() => closeModal(false)}
                  className="bg-maroon w-20 text-white font-bold py-2 px-4 rounded-3xl shadow-md hover:bg-white hover:text-black active:shadow-lg transition duration-150 ease-in-out"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
