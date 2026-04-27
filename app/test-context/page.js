"use client";
import { useMenuContext } from "../hooks/useMenuContext";
export default function TestContext() {
    const { loginUserData, loadingUserData, Get_SingleData_User, UserLoginId, isMenuOpen, toggleMenu } = useMenuContext();
    console.log("Test Context - UserLoginId:", UserLoginId);
    console.log("Test Context - loginUserData:", loginUserData);
    console.log("Test Context - loadingUserData:", loadingUserData);
    const handleGetUserData = () => {
        if (UserLoginId) {
            console.log("Calling Get_SingleData_User with ID:", UserLoginId);
            Get_SingleData_User(UserLoginId);
        }
        else {
            console.log("No UserLoginId found");
        }
    };
    return (<div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">MenuContext Test Page</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Context Status</h2>
          
          <div className="space-y-2">
            <p><strong>UserLoginId:</strong> {UserLoginId || "Not found"}</p>
            <p><strong>Menu Open:</strong> {isMenuOpen ? "Yes" : "No"}</p>
            <p><strong>Loading:</strong> {loadingUserData ? "Yes" : "No"}</p>
            <p><strong>User Data:</strong> {loginUserData ? "Available" : "Not available"}</p>
          </div>

          <div className="mt-4 space-x-4">
            <button onClick={toggleMenu} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Toggle Menu
            </button>
            
            <button onClick={handleGetUserData} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
              Get User Data
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Data</h2>
          
          {loginUserData ? (<div className="space-y-2">
              <p><strong>Name:</strong> {loginUserData.FirstName} {loginUserData.LastName}</p>
              <p><strong>Email:</strong> {loginUserData.Email}</p>
              <p><strong>Mobile:</strong> {loginUserData.MobileNo}</p>
              <p><strong>ID:</strong> {loginUserData.ID}</p>
            </div>) : (<p className="text-gray-500">No user data available</p>)}
        </div>
      </div>
    </div>);
}
