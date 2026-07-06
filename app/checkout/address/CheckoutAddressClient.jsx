"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { FaGem } from "react-icons/fa6";
import { postWithToken, TokenWithDeleteUpadateAdd } from "../../utils/api.js";
import { MdDeleteOutline } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useMenuContext } from "../../hooks/useMenuContext";
// Custom Modal component (replacement for react-modal)
const CustomModal = ({ isOpen, onClose, children }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white p-4 sm:p-6 md:p-8 max-w-md mx-auto rounded-lg sm:rounded-xl shadow-xl border border-gray-200 w-[90vw] sm:w-full">
        {children}
      </div>
    </div>);
};
const GemstoneAddress = () => {
    const { loginUserData } = useMenuContext();
    const UserLoginId = typeof window !== 'undefined' ? localStorage.getItem("UserLoginId") || '' : '';
    const router = useRouter();
    const [addresses, setaddresses] = useState([]);
    const [UserAddressID, setUserAddressID] = useState('');
    const [isPopUPOpen, setIsPopupOpen] = useState(false);
    const [deleteaddreeid, setdeleteaddreeid] = useState('');
    const [gemstoneData] = useState(() => {
        if (typeof window === 'undefined') return null;
        try {
            const storedProduct = sessionStorage.getItem('selectedGemstone');
            return storedProduct ? JSON.parse(storedProduct) : null;
        } catch {
            return null;
        }
    });
    const [value, setValue] = useState({
        UserID: '', Name: '', NickName: '', MobileNo: '', AltMobileNo: '', emailid: '', FlatNo: '', Locality: '', City: '', State: '', Country: '', PinCode: '', Landmark: '', CreatedByUser: '', OrderNumber: '', GemstoneId: '', GemstoneName: '', OrderStatus: '', PaymentStatus: '', Amt: '', GSTAmt: '', Qty: '', LocationID: '', TransactionID: ''
    });
    const [errors, setErrors] = useState({
        'Name': '', 'NickName': '', 'MobileNo': '', 'City': '', 'State': '', 'Address': '', 'UserName': '', 'PinCode': '',
    });
    const handleChange = (e) => {
        const { name, value: inputValue } = e.target;
        setValue((prev) => ({
            ...prev,
            [name]: inputValue,
        }));
    };
    const validateForm = () => {
        let newErrors = {};
        if (!value.NickName)
            newErrors.NickName = 'Name is required';
        if (!value.MobileNo || value.MobileNo.length !== 10)
            newErrors.MobileNo = 'Enter a valid 10-digit mobile number';
        if (!value.emailid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.emailid))
            newErrors.emailid = 'Enter a valid email';
        if (!value.City)
            newErrors.City = 'City is required';
        if (!value.State)
            newErrors.State = 'State is required';
        if (!value.Country)
            newErrors.Country = 'Country is required';
        if (!value.PinCode || value.PinCode.length !== 6)
            newErrors.PinCode = 'Enter a valid 6-digit pin code';
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            if (UserAddressID) {
                UpDate_UserAddress_Data();
            }
            else {
                Insert_UserAddress_Data();
            }
        }
    };
    const handleNumberChange = (e) => {
        const { name, value: inputValue } = e.target;
        if (/^[0-9]*$/.test(inputValue)) {
            setValue((prev) => ({
                ...prev,
                [name]: inputValue,
            }));
        }
    };
    const closeModal = () => {
        setIsPopupOpen(false);
    };
    const Get_Data_UserAddress = useCallback(async () => {
        const val = {
            'UserID': UserLoginId,
            'IsActive': '1',
        };
        try {
            const res = await postWithToken('UserAddress/GetData_UserAddress', val);
            if (res?.length > 0) {
                setaddresses(res);
            }
            else {
                setaddresses([]);
            }
        }
        catch (error) {
            console.log(error);
        }
    }, [UserLoginId]);

    useEffect(() => {
        if (UserLoginId) {
            queueMicrotask(() => { Get_Data_UserAddress(); });
        }
    }, [UserLoginId, Get_Data_UserAddress]);
    const Insert_UserAddress_Data = async () => {
        try {
            const { NickName, MobileNo, AltMobileNo, emailid, FlatNo, Locality, City, State, Country, PinCode, Landmark } = value;
            const val = {
                UserID: UserLoginId, NickName: NickName, MobileNo: MobileNo, AltMobileNo: AltMobileNo, emailid: emailid, FlatNo: FlatNo, Locality: Locality, City: City, State: State,
                Country: Country, PinCode: PinCode, Landmark: Landmark, CreatedByUser: '1',
            };
            const res = await TokenWithDeleteUpadateAdd('UserAddress/Insert_UserAddress', val);
            if (res) {
                Get_Data_UserAddress();
                reset();
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const Delete_UserAddress_Data = async () => {
        try {
            const val = { ID: deleteaddreeid, IsActive: "0", DeleteByUser: "0" };
            const res = await TokenWithDeleteUpadateAdd('UserAddress/Delete_UserAddress', val);
            if (res) {
                setIsPopupOpen(false);
                Get_Data_UserAddress();
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const applyAddressRow = (row) => {
        setValue((prev) => ({
            ...prev,
            NickName: row?.NickName || '',
            MobileNo: row?.MobileNo || '',
            AltMobileNo: row?.AltMobileNo || '',
            emailid: row?.emailid || '',
            FlatNo: row?.FlatNo || '',
            Locality: row?.Locality || '',
            City: row?.City || '',
            State: row?.State || '',
            Country: row?.Country || '',
            PinCode: row?.PinCode || '',
            Landmark: row?.Landmark || '',
        }));
    };

    const reset = () => {
        setValue((prev) => ({
            ...prev,
            NickName: '', MobileNo: '', AltMobileNo: '', emailid: '', FlatNo: '', Locality: '', City: '', State: '', Country: '', PinCode: '', Landmark: '',
        }));
    };
    const Get_Single_UserAddress_Data = async (id) => {
        try {
            const val = { ID: id };
            const res = await postWithToken('UserAddress/GetSinglaData_UserAddress', val);
            if (res?.[0]) {
                applyAddressRow(res[0]);
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const UpDate_UserAddress_Data = async () => {
        try {
            const { NickName, MobileNo, AltMobileNo, emailid, FlatNo, Locality, City, State, Country, PinCode, Landmark } = value;
            const val = {
                NickName: NickName, MobileNo: MobileNo, AltMobileNo: AltMobileNo, emailid: emailid, FlatNo: FlatNo, Locality: Locality, City: City, State: State,
                Country: Country, PinCode: PinCode, Landmark: Landmark, ModifiedByUser: '1', ID: UserAddressID,
            };
            const res = await TokenWithDeleteUpadateAdd('UserAddress/UpDate_UserAddress', val);
            if (res) {
                Get_Data_UserAddress();
                reset();
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const handleDeliverToAddress = (address) => {
        // Store address ID in sessionStorage for payment page
        if (typeof window !== 'undefined') {
            sessionStorage.setItem("AddressLocationID", address?.ID);
        }
        // Navigate to payment page with product data
        router.push("/checkout/payment");
    };
    return (<>
            <div className="relative min-h-screen pt-[72px] py-8 sm:py-12" style={{ backgroundColor: "#FFF9F1" }}>
                <div className="absolute bottom-[0] left-[30%] right-image">
                    {/* <img className="" src={gemstone_1} alt="" /> */}
                </div>
                <div className="main-container px-3 sm:px-4">
                    <div className="bg-[#FF5C00] text-white text-center py-6 sm:py-8 md:py-10 rounded-lg sm:rounded-xl shadow-sm">
                        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 px-2">
                            <div className="text-xl sm:text-2xl mt-1">
                                <FaGem />
                            </div>
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                                Astrological Gemstones
                            </h2>
                        </div>

                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base max-w-xl mx-auto opacity-90 px-2">
                            Discover the mystical power of gemstones and their connection to
                            your zodiac sign. Each gemstone carries unique energies that can
                            enhance specific aspects of your life.
                        </p>

                        <div className="w-10 sm:w-12 h-[2px] bg-white mx-auto mt-4 sm:mt-5 rounded-full"></div>
                    </div>
                </div>

                <div className="main-container px-3 sm:px-4">
                    <div className="flex flex-col items-center py-6 sm:py-8 md:py-10">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-center px-2">Continue with your saved address</h2>
                        <div className="flex flex-wrap gap-4 sm:gap-6 w-full max-h-[300px] sm:max-h-[400px] overflow-y-auto justify-center pr-2 sm:pr-3">
                            {addresses?.length > 0 ? (addresses.map((address) => (<div key={address?.ID} className="cursor-pointer border border-orange-400 p-4 sm:p-5 rounded-lg sm:rounded-xl shadow-lg w-full sm:w-80 md:w-96 bg-white relative hover:shadow-xl transition duration-200" onClick={() => {
                Get_Single_UserAddress_Data(address?.ID);
                setUserAddressID(address?.ID);
            }}>
                                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <h4 className="font-semibold text-base sm:text-lg text-gray-800 truncate">{address?.NickName}</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{address?.MobileNo}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{address?.emailid}</p>
                                                <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {address?.Locality}, {address?.City}, {address?.State} - {address?.PinCode}
                                                </p>
                                            </div>
                                            <button onClick={(e) => {
                e.stopPropagation();
                setdeleteaddreeid(address?.ID);
                setIsPopupOpen(true);
            }} className="text-red-500 hover:text-red-700 flex-shrink-0 p-1" aria-label="Delete address">
                                                <MdDeleteOutline className="w-5 h-5 sm:w-6 sm:h-6"/>
                                            </button>
                                        </div>

                                        <button onClick={(e) => {
                e.stopPropagation();
                handleDeliverToAddress(address);
            }} className="w-full py-2 sm:py-2.5 bg-[#FF5C00] hover:bg-[#E85500] text-white rounded-lg font-semibold mt-2 text-sm sm:text-base transition shadow-md hover:shadow-lg">
                                            🚚 Deliver To This Address
                                        </button>
                                    </div>))) : (<p className="text-gray-500 text-sm sm:text-base text-center py-4">No saved addresses found</p>)}
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto bg-orange-50 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-2 border-orange-300 shadow-md mt-6 sm:mt-8">
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 sm:mb-6">Save Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                            {/* Name */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Name: *</label>
                                <input type="text" name="NickName" value={value.NickName} onChange={handleChange} placeholder="Enter Name" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.NickName && <p className="text-red-500 text-xs mt-1">{errors.NickName}</p>}
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Mobile Number: *</label>
                                <input type="text" name="MobileNo" value={value.MobileNo} onChange={handleNumberChange} placeholder="Enter Mobile Number" maxLength={10} className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.MobileNo && <p className="text-red-500 text-xs mt-1">{errors.MobileNo}</p>}
                            </div>

                            {/* Alternative Number */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Alternative Number</label>
                                <input type="text" name="AltMobileNo" value={value.AltMobileNo} onChange={handleNumberChange} placeholder="Enter alternative mobile no." maxLength={10} className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400"/>
                                {errors.AltMobileNo && <p className="text-red-500 text-xs mt-1">{errors.AltMobileNo}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Email ID: *</label>
                                <input type="email" name="emailid" value={value.emailid} onChange={handleChange} placeholder="Enter email" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.emailid && <p className="text-red-500 text-xs mt-1">{errors.emailid}</p>}
                            </div>

                            {/* Flat No */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Flat No: *</label>
                                <input type="text" name="FlatNo" value={value.FlatNo} onChange={handleChange} placeholder="Flat / Building / House No" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.FlatNo && <p className="text-red-500 text-xs mt-1">{errors.FlatNo}</p>}
                            </div>

                            {/* Locality */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Locality: *</label>
                                <input type="text" name="Locality" value={value.Locality} onChange={handleChange} placeholder="Locality" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.Locality && <p className="text-red-500 text-xs mt-1">{errors.Locality}</p>}
                            </div>

                            {/* City */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">City: *</label>
                                <input type="text" name="City" value={value.City} onChange={handleChange} placeholder="City" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.City && <p className="text-red-500 text-xs mt-1">{errors.City}</p>}
                            </div>

                            {/* State */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">State: *</label>
                                <input type="text" name="State" value={value.State} onChange={handleChange} placeholder="State" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.State && <p className="text-red-500 text-xs mt-1">{errors.State}</p>}
                            </div>

                            {/* Country */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Country: *</label>
                                <input type="text" name="Country" value={value.Country} onChange={handleChange} placeholder="Country" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.Country && <p className="text-red-500 text-xs mt-1">{errors.Country}</p>}
                            </div>

                            {/* Pincode */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">PinCode: *</label>
                                <input type="text" name="PinCode" value={value.PinCode} onChange={handleNumberChange} maxLength={6} placeholder="Postal Code / PinCode" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400" required/>
                                {errors.PinCode && <p className="text-red-500 text-xs mt-1">{errors.PinCode}</p>}
                            </div>

                            {/* Landmark */}
                            <div>
                                <label className="block font-medium text-xs sm:text-sm mb-1">Landmark</label>
                                <input type="text" name="Landmark" value={value.Landmark} onChange={handleChange} placeholder="Landmark (Optional)" className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-orange-400"/>
                                {errors.Landmark && <p className="text-red-500 text-xs mt-1">{errors.Landmark}</p>}
                            </div>

                            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg flex items-center shadow-md hover:shadow-lg transition text-sm sm:text-base" onClick={validateForm}>
                                    <span className="mr-2">📥</span>
                                    {UserAddressID ? 'Update Address' : 'Save Address'}
                                </button>

                                <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-md hover:shadow-lg transition text-sm sm:text-base" onClick={() => {
            reset();
            setUserAddressID('');
        }}>
                                    ➕ New Address
                                </button>
                            </div>
                        </div>
                    </div>

                    <CustomModal isOpen={isPopUPOpen} onClose={closeModal}>
                        <h5 className="text-base sm:text-lg font-semibold text-center text-gray-800 mb-4">
                            Are you sure you want to delete this address?
                        </h5>

                        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-4">
                            <button onClick={closeModal} className="px-5 sm:px-6 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold text-sm sm:text-base">
                                Cancel
                            </button>
                            <button onClick={Delete_UserAddress_Data} className="px-5 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm sm:text-base">
                                Delete
                            </button>
                        </div>
                    </CustomModal>
                </div>
            </div>
        </>);
};
export default GemstoneAddress;
