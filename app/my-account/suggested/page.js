"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TokenWithDeleteUpadateAdd, postWithToken } from '../../utils/api';
import { FaTrashAlt } from 'react-icons/fa';
import { MdDeleteOutline } from 'react-icons/md';

const Suggested = () => {
    const router = useRouter();
    const UserLoginId = localStorage.getItem("UserLoginId") || "";

    const [SuggestionsData, setSuggestionsData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [loading, setLoading] = useState(true);
    const [activeButton, setActiveButton] = useState('GemStone');
    const [isPopUPOpen, setIsPopupOpen] = useState(false);
    const [isPopUPDelete, setIsPopupDelete] = useState(false);
    const [SuggestId, setSuggestId] = useState();
    const [isOpen, setisOpen] = useState(false);
    const [SuggestSinglaData, setSuggestSinglaData] = useState();
    const [SuggestSinglaTotalAmt, setSuggestSinglaTotalAmt] = useState();
    const [GstAmt, setGstAmt] = useState();
    const [ProductName, setProductName] = useState();
    const [ProductId, setProductId] = useState();
    const [AstrologerId, setAstrologerId] = useState();
    const [SuggestIdsungledata, setSuggestIdsungledata] = useState();
    const [AddressData, setAddressData] = useState(false);
    const [Editval, setEditval] = useState([]);
    const [deleteaddreeid, setdeleteaddreeid] = useState();
    const [UserAddressID, setUserAddressID] = useState();
    const [Suggestionsitem, setSuggestionsitem] = useState();
    const [addresses, setaddresses] = useState();

    const [value, setValue] = useState({
        UserID: '', Name: '', NickName: '', MobileNo: '', AltMobileNo: '', emailid: '', FlatNo: '', Locality: '', City: '', State: '', Country: '', PinCode: '', Landmark: '',
        CreatedByUser: '', OrderNumber: '', GemstoneId: '', GemstoneName: '', OrderStatus: '', PaymentStatus: '', Amt: '', GSTAmt: '', Qty: '', LocationID: '', TransactionID: ''
    });

    const [errors, setErrors] = useState({
        'Name': '', 'NickName': '', 'MobileNo': '', 'City': '', 'State:': '', 'Address': '', 'UserName': '', 'PinCode': '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!value.NickName) newErrors.NickName = 'Name is required';
        if (!value.MobileNo || value.MobileNo.length !== 10) newErrors.MobileNo = 'Enter a valid 10-digit mobile number';
        if (!value.emailid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.emailid)) newErrors.emailid = 'Enter a valid email';
        if (!value.City) newErrors.City = 'City is required';
        if (!value.State) newErrors.State = 'State is required';
        if (!value.Country) newErrors.Country = 'Country is required';
        if (!value.PinCode || value.PinCode.length !== 6) newErrors.PinCode = 'Enter a valid 6-digit pin code';

        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            if (UserAddressID) {
                UpDate_UserAddress_Data();
            } else {
                Insert_UserAddress_Data();
            }
        }
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        if (/^[0-9]*$/.test(value)) {
            setValue((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        if (UserLoginId) {
            fetchSuggestions();
        }
    }, [UserLoginId, activeButton]);

    const Delete_Suggestions = async (Id) => {
        try {
            const val = {
                SuggestId: Id
            };
            const res = await TokenWithDeleteUpadateAdd("Suggestions/Delete_Suggestions", val);
            if (res) {
                fetchSuggestions();
                setIsPopupOpen(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await postWithToken("Suggestions/GetData_Suggestions", {
                UseriD: UserLoginId,
                AstrologerId: "0",
                ProductType: activeButton,
            });
            if (res) {
                setSuggestionsData(res);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const GetSinglaData_Suggestions = async (id) => {
        try {
            const val = {
                SuggestId: id,
                ProductType: activeButton
            };
            const res = await postWithToken("Suggestions/GetData_Suggestions", val);
            if (res) {
                setSuggestionsitem(res[0]);
                setSuggestSinglaData(res);
                setSuggestSinglaTotalAmt(res[0]?.TotalAmt);
                setAstrologerId(res[0]?.AstrologerId);
                setProductName(res[0]?.ProductName);
                setProductId(res[0]?.ProductId);
                setGstAmt(res[0]?.GstAmt);
                setSuggestIdsungledata(res[0]?.SuggestId);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = SuggestionsData?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(SuggestionsData.length / itemsPerPage);

    const renderSuggestionCard = (item, index) => (
        <div
            key={index}
            className="bg-white shadow border border-gray-200 p-6 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
            {/* Header Section */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs text-gray-400">
                        Order ID: <span className="text-blue-600 font-semibold">#{item?.SuggestId || 'N/A'}</span>
                    </p>
                    <p className="text-base font-semibold text-gray-800 mt-1">
                        {item?.AstroName}
                        <span className="ml-2 text-sm text-gray-500">
                            (<strong>{item?.AstrologerId}</strong>)
                        </span>
                    </p>
                </div>
                <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${item?.Status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {item?.Status}
                </span>
            </div>

            {/* Product Info Section */}
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                        {item?.ProductName}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Date:{" "}
                        {item?.CreatedAt
                            ? new Date(item.CreatedAt).toLocaleString()
                            : "N/A"}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        Amount: <span className="font-medium">₹{item?.TotalAmt || 0}</span>
                    </p>
                </div>
                <img
                    src={
                        item?.ProductImage
                            ? `https://${item.ProductImage.replace(/\\/g, "/")}` 
                            : "https://via.placeholder.com/60"
                    }
                    alt="Product"
                    className="w-16 h-16 rounded-lg object-cover border"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={() => {
                        GetSinglaData_Suggestions(item?.SuggestId);
                        setisOpen(true);
                        setAddressData(activeButton === 'GemStone');
                    }}
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2 rounded-md transition"
                >
                    {activeButton === 'Puja' ? 'Book Puja' : 'Buy Now'}
                </button>
                <button
                    onClick={() => {
                        setSuggestId(item?.SuggestId);
                        setIsPopupOpen(true);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm px-3 py-2 rounded-md transition"
                >
                    <FaTrashAlt className="text-sm" />
                </button>
            </div>
        </div>
    );

    useEffect(() => {
        if (UserLoginId) {
            Get_Data_UserAddress();
        }
    }, [UserLoginId]);

    const Get_Data_UserAddress = async () => {
        const val = {
            'UserID': UserLoginId,
            'IsActive': '1',
        };
        try {
            const res = await postWithToken('UserAddress/GetData_UserAddress', val);
            if (res?.length > 0) {
                setaddresses(res);
            } else {
                setaddresses([]);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                setAddressData(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (Editval) {
            setValue({
                ...value,
                'NickName': Editval[0]?.NickName, 'MobileNo': Editval[0]?.MobileNo, 'AltMobileNo': Editval[0]?.AltMobileNo, 'emailid': Editval[0]?.emailid, 'FlatNo': Editval[0]?.FlatNo, 'Locality': Editval[0]?.Locality, 'City': Editval[0]?.City, 'State': Editval[0]?.State, 'Country': Editval[0]?.Country, 'PinCode': Editval[0]?.PinCode, 'Landmark': Editval[0]?.Landmark,
            });
        } else {
            setValue({
                ...value,
                NickName: '', MobileNo: '', AltMobileNo: '', emailid: '', FlatNo: '', Locality: '', City: '', State: '', Country: '', PinCode: '', Landmark: '', CreatedByUser: '',
            });
        }
    }, [Editval]);

    const reset = () => {
        setValue({
            ...value,
            NickName: '', MobileNo: '', AltMobileNo: '', emailid: '', FlatNo: '', Locality: '', City: '', State: '', Country: '', PinCode: '', Landmark: '',
        });
    };

    const Delete_UserAddress_Data = async () => {
        try {
            const val = { ID: deleteaddreeid, IsActive: "0", DeleteByUser: "0" };
            const res = await TokenWithDeleteUpadateAdd('UserAddress/Delete_UserAddress', val);
            if (res) {
                setIsPopupDelete(false);
                Get_Data_UserAddress();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const Get_Single_UserAddress_Data = async (id) => {
        try {
            const val = { ID: id };
            const res = await postWithToken('UserAddress/GetSinglaData_UserAddress', val);
            if (res) {
                setEditval(res);
            }
        } catch (error) {
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
                setAddressData(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen p-4">
            <div className="main-container mx-auto">
                <h1 className="text-2xl text-orange-500 font-semibold mb-1">Suggested</h1>
                <p className="text-gray-600 text-sm mb-6">View your recommended suggestions and purchases.</p>

                <div className="flex space-x-4 mb-4">
                    <button
                        className={`px-4 py-2 rounded ${activeButton === 'GemStone' ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => setActiveButton('GemStone')}
                    >
                        GemStone
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${activeButton === 'Puja' ? 'bg-orange-500 text-white' : 'bg-gray-300 text-black'}`}
                        onClick={() => setActiveButton('Puja')}
                    >
                        Online Puja
                    </button>
                </div>

                {/* Loader */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        {currentItems?.length > 0 ? (
                            <div className="space-y-6">
                                {currentItems.map((item, index) => renderSuggestionCard(item, index))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 font-medium py-20">
                                No data available.
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10 gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Prev
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter((page) =>
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    )
                                    .map((page, index, arr) => {
                                        const prev = arr[index - 1];
                                        const showEllipsis = prev && page - prev > 1;
                                        return (
                                            <React.Fragment key={page}>
                                                {showEllipsis && <span className="px-2 text-gray-400">...</span>}
                                                <button
                                                    className={`px-4 py-2 rounded-md ${currentPage === page
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-200 hover:bg-gray-300"
                                                        }`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    })}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                {isPopUPOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                            <h5 className="text-xl font-semibold mb-4">Are you sure you want to delete this?</h5>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => Delete_Suggestions(SuggestId)}
                                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setIsPopupOpen(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Address Modal */}
                {isPopUPDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
                            <h5 className="text-xl font-semibold mb-4">Are you sure you want to delete this Address?</h5>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => Delete_UserAddress_Data(deleteaddreeid)}
                                    className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setIsPopupDelete(false)}
                                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Modal */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[65vh] flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b bg-white sticky top-0 z-10">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {AddressData ? "Select or Add Address" : "Payment Details"}
                                </h2>
                                <button
                                    onClick={() => setisOpen(false)}
                                    className="text-3xl text-gray-400 hover:text-gray-600 transition"
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Body */}
                            <div className="flex-1 overflow-y-auto">
                                {AddressData ? (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                                        {/* Left - Saved Addresses */}
                                        <div className="p-6 space-y-6 border-r">
                                            <h3 className="text-lg font-semibold text-gray-700">Saved Addresses</h3>
                                            <div className="space-y-4">
                                                {addresses?.map((address) => (
                                                    <div
                                                        key={address?.ID}
                                                        onClick={() => {
                                                            Get_Single_UserAddress_Data(address?.ID);
                                                            setUserAddressID(address?.ID);
                                                        }}
                                                        className={`border rounded-xl p-5 cursor-pointer transition hover:shadow-md relative ${UserAddressID === address?.ID
                                                            ? "border-orange-500 bg-orange-50"
                                                            : "border-gray-200"
                                                            }`}
                                                    >
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setdeleteaddreeid(address?.ID);
                                                                setIsPopupDelete(true);
                                                            }}
                                                            className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                                                        >
                                                            <MdDeleteOutline className="w-5 h-5" />
                                                        </button>
                                                        <h4 className="font-bold text-gray-800">{address?.NickName}</h4>
                                                        <p className="text-sm text-gray-600">{address?.MobileNo}</p>
                                                        <p className="text-sm text-gray-600">{address?.emailid}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {address?.Locality}, {address?.City}, {address?.State} - {address?.PinCode}
                                                        </p>
                                                        <button className="mt-3 w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition">
                                                            🚚 Deliver Here
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right - Add / Update Form */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">
                                                {UserAddressID ? "Update Address" : "Add New Address"}
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {[
                                                    { name: "NickName", label: "Name *", placeholder: "Enter Name" },
                                                    { name: "MobileNo", label: "Mobile *", placeholder: "Enter mobile number" },
                                                    { name: "AltMobileNo", label: "Alt Number", placeholder: "Optional" },
                                                    { name: "emailid", label: "Email *", placeholder: "Enter email" },
                                                    { name: "FlatNo", label: "Flat No *", placeholder: "Flat / Building" },
                                                    { name: "Locality", label: "Locality *", placeholder: "Locality" },
                                                    { name: "City", label: "City *", placeholder: "City" },
                                                    { name: "State", label: "State *", placeholder: "State" },
                                                    { name: "Country", label: "Country *", placeholder: "Country" },
                                                    { name: "PinCode", label: "Pincode *", placeholder: "Postal Code" },
                                                    { name: "Landmark", label: "Landmark", placeholder: "Optional" },
                                                ].map((field) => (
                                                    <div key={field.name}>
                                                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                                        <input
                                                            name={field.name}
                                                            value={value[field.name]}
                                                            onChange={
                                                                field.name.includes("Mobile") || field.name === "PinCode"
                                                                    ? handleNumberChange
                                                                    : handleChange
                                                            }
                                                            placeholder={field.placeholder}
                                                            className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-orange-400"
                                                        />
                                                        {errors[field.name] && (
                                                            <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex justify-end gap-4 mt-6">
                                                <button
                                                    onClick={validateForm}
                                                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
                                                >
                                                    📥 {UserAddressID ? "Update" : "Save"}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        reset();
                                                        setUserAddressID("");
                                                    }}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg"
                                                >
                                                    ➕ New
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Payment Section */
                                    <div className="grid md:grid-cols-2 gap-8 p-6">
                                        {/* Summary */}
                                        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-4">🛒 Order Summary</h3>

                                            {SuggestSinglaData?.map((item, index) => (
                                                <div key={index} className="space-y-3 text-gray-800 text-sm">
                                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                                        <span>Product</span>
                                                        <span className="font-medium">{item?.ProductName}</span>
                                                    </div>
                                                    <div className="flex justify-between pb-2 border-b border-gray-200">
                                                        <span>GST (18%)</span>
                                                        <span className="font-medium">₹ {item?.GstAmt}</span>
                                                    </div>
                                                    <div className="flex justify-between text-lg font-bold text-green-700 pt-3">
                                                        <span>Total</span>
                                                        <span>₹{item?.TotalAmt}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Payment Methods */}
                                        <div className="from-orange-50 via-white rounded-2xl shadow-lg border border-orange-100 p-6">
                                            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                                                💳 Select Payment Method
                                            </h3>

                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <button
                                                    onClick={() => setisOpen(false)}
                                                    className="border p-3 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center transition gap-1 w-24 h-20"
                                                >
                                                    <div className="w-14 h-14 flex items-center justify-center">
                                                        <div className="text-blue-600 font-bold">Card</div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-center leading-tight">Card</span>
                                                </button>
                                                <button
                                                    onClick={() => setisOpen(false)}
                                                    className="border p-3 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center transition gap-1 w-24 h-20"
                                                >
                                                    <div className="w-14 h-14 flex items-center justify-center">
                                                        <div className="text-green-600 font-bold">UPI</div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-center leading-tight">UPI</span>
                                                </button>
                                                <button
                                                    onClick={() => setisOpen(false)}
                                                    className="border p-3 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center transition gap-1 w-24 h-20"
                                                >
                                                    <div className="w-14 h-14 flex items-center justify-center">
                                                        <div className="text-purple-600 font-bold">Wallet</div>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-center leading-tight">Wallet</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Suggested;
