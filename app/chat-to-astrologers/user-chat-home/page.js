"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { postWithToken } from '../../utils/api';
import { IoCloudOffline } from 'react-icons/io5';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import socketService from '@/app/services/socketService';
import Image from 'next/image';

const UserChatHome = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const UserLoginId = localStorage.getItem("UserLoginId") || '';

    // Get query parameters
    const AstroId = searchParams.get('AstroId');
    const Type = searchParams.get('Type');
    const IsHomePage = searchParams.get('IsHomePage');

    const [errors, setErrors] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [astrodata, setastrodata] = useState();
    const [WaitingListAdd, setWaitingListAdd] = useState(false);
    const [astroname, setastroname] = useState();
    const [astroimage, setastroimage] = useState();
    const [ChatUserBioID, setChatUserBioID] = useState("1618");
    const [TOB, setTOB] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [Editval, setEditval] = useState([]);
    const [loginUserData, setLoginUserData] = useState(null);
    const [ws, setWs] = useState(null);


    const [value, setValue] = useState({
        UserID: '', NickName: '', Name: '', DOB: '', TOB: '', POB: '', Gender: '', Occupation: '', Marital: '', TopicofConcern: '', CreatedByUser: '', longitude: '', latitude: ''
    });

    // Mock WebSocket context - replace with actual implementation
    useEffect(() => {
        // Initialize WebSocket connection if needed
        // This is a placeholder - implement actual WebSocket logic
        const mockWs = {
            readyState: WebSocket.OPEN,
            send: (message) => console.log('WebSocket message:', message)
        };
        setWs(mockWs);

        // Mock login user data
        const mockLoginData = {
            FirstName: 'John',
            LastName: 'Doe',
            ProfilePic: null
        };
        setLoginUserData(mockLoginData);
    }, []);

    useEffect(() => {
        if (Editval && Editval.length > 0) {
            setValue({
                UserID: Editval[0]?.UserID || '',
                NickName: Editval[0]?.NickName || '',
                Name: Editval[0]?.FirstName ? `${Editval[0]?.FirstName} ${Editval[0]?.LastName}`.trim() : '',
                DOB: Editval[0]?.DOB || '',
                TOB: Editval[0]?.TOB || '',
                POB: Editval[0]?.POB || '',
                Gender: Editval[0]?.Gender || '',
                Occupation: Editval[0]?.Occupation || '',
                Marital: Editval[0]?.Marital || '',
                TopicofConcern: Editval[0]?.TopicofConcern || '',
                longitude: Editval[0]?.longitude || '',
                latitude: Editval[0]?.latitude || '',
                CreatedByUser: Editval[0]?.CreatedByUser || ''
            });
            setTOB(
                Editval[0]?.TOB ? parseTobStringToDate(Editval[0]?.TOB) : null
            );
        } else {
            setValue({
                UserID: '',
                NickName: '',
                Name: '',
                DOB: '',
                TOB: '',
                POB: '',
                Gender: '',
                Occupation: '',
                Marital: '',
                TopicofConcern: '',
                CreatedByUser: '',
                longitude: '',
                latitude: ''
            });
        }
    }, [Editval, loginUserData]);

    useEffect(() => {
        if (WaitingListAdd) {
            const timer = setTimeout(() => {
                setWaitingListAdd(false);
                router.push('/chat-to-astrologers')
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [WaitingListAdd]);

    const handleChange = (e) => {
        const { name, value: val } = e.target;
        setValue((prevData) => ({ ...prevData, [name]: val }));
    };

    const validate = () => {
        const newErrors = {};
        if (!value.NickName) newErrors.NickName = "Name is required.";
        if (!/^[A-Za-z ]*$/.test(value.NickName)) newErrors.NickName = "Only alphabets are allowed";
        if (!value.TOB) newErrors.TOB = "Time of Birth is required.";
        if (!value.Gender) newErrors.Gender = "Gender is required.";
        if (!value.Occupation) newErrors.Occupation = "Occupation is required.";
        if (!value.TopicofConcern) newErrors.TopicofConcern = "TopicofConcern is required.";
        if (!value.Marital) newErrors.Marital = "Marital is required.";
        if (!value.POB) {
            newErrors.POB = "Birth Place is required.";
        } else if (!value.latitude || !value.longitude) {
            newErrors.POB = "Please select a valid Birth Place from the list.";
        }

        if (!value.DOB) newErrors.DOB = "Date of Birth is required.";

        return newErrors;
    };

    useEffect(() => {
        if (UserLoginId && AstroId) {
            GetData_Astrologer()
        }
    }, [UserLoginId, AstroId])

    const GetData_Astrologer = async () => {
        try {
            setIsLoading(true);
            const val = { IsActive: "1" };
            const res = await postWithToken("Astrologer/UserGetData_Astrologer", val);

            if (res?.length > 0) {
                const filterAstroData = res?.filter((data) => data?.ID == AstroId);
                if (filterAstroData?.length > 0) {
                    setastrodata(filterAstroData);
                    setastroimage(filterAstroData[0]?.AvatarUrl);
                    setastroname(filterAstroData[0]?.DisplayName);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            // Check Type parameter first (even if IsHomePage is true)
            if (Type === "call") {
                InsertWaitingList();
                // toastifySuccess("Successfully Insert");
                router.push('/talk-to-astrologers');
                return;
            }

            if (Type === "chat") {
                InsertWaitingList();
                // toastifySuccess("Successfully Insert");
                router.push('/chat-to-astrologers');
                return;
            }

            // Check IsHomePage - only navigate to home if Type is not specified
            if (IsHomePage === "true" || IsHomePage === true) {
                InsertWaitingList();
                // toastifySuccess("Successfully Insert");
                // If Type is not specified, check astrodata to determine navigation
                if (astrodata[0]?.IsChat === "true" || astrodata[0]?.IsChat === true) {
                    router.push('/chat-to-astrologers');
                } else if (astrodata[0]?.IsCall === "true" || astrodata[0]?.IsCall === true) {
                    router.push('/talk-to-astrologers');
                } else {
                    router.push('/');
                }
                return;
            }

            // Fallback to original logic
            if (astrodata[0]?.IsChat === "true" || astrodata[0]?.IsChat === true) {
                InsertWaitingList();
                // toastifySuccess("Successfully Insert")
                router.push('/chat-to-astrologers')
            }
            else if (astrodata[0]?.IsCall === "true" || astrodata[0]?.IsCall === true) {
                InsertWaitingList();
                // toastifySuccess("Successfully Insert")
                router.push('/talk-to-astrologers')
            }
            else {
                setIsOpen(true)
            }
            setErrors({});
        }
    };



    const InsertWaitingList = () => {
        if (!ChatUserBioID) {
            console.log("No ChatUserBioID → inserting new data");
            Insert_UserChat_Data();
            return;
        }

        if (!socketService.userSocket || socketService.userSocket.readyState !== WebSocket.OPEN) {
            console.warn("⚠️ WebSocket not connected yet!");
            return;
        }

        const payload = {
            AstroId: `WA${AstroId}`,
            UserId: `WU${UserLoginId}`,
            Status: "InsertWaitingList",
            Type: Type,
            ChatUserBioID: ChatUserBioID,
            messageId: "NewRequest",
        };

        console.log("📤 InsertWaitingList:", payload);

        socketService.sendUser(payload);

        // optional API update
        UpDate_CHATINTAKEFORM_Data();
    };

    const Insert_UserChat_Data = async () => {
        try {
            const val = {
                UserID: UserLoginId,
                Name: value?.NickName,
                DOB: value.DOB,
                TOB: value.TOB,
                POB: value.POB,
                Gender: value.Gender,
                Occupation: value.Occupation,
                Marital: value.Marital,
                TopicofConcern: value.TopicofConcern,
                CreatedByUser: "1",
                latitude: value?.latitude,
                longitude: value?.longitude,
            };

            const res = await postWithToken("CHATINTAKEFORM/Insert_CHATINTAKEFORM", val);

            if (!res?.ChatUserBioID) {
                console.log("❌ Insert failed:", res);
                return;
            }

            console.log("✅ ChatUserBioID created:", res.ChatUserBioID);

            // update local data
            Get_CHATINTAKEFORM_UserData();

            // 🔥 SAME SOCKET CALL (clean)
            const payload = {
                AstroId: `WA${AstroId}`,
                UserId: `WU${UserLoginId}`,
                Status: "InsertWaitingList",
                Type: Type,
                ChatUserBioID: res.ChatUserBioID,
                messageId: "NewRequest",
            };

            socketService.sendUser(payload);

        } catch (error) {
            console.error("❌ Insert_UserChat_Data error:", error);
        }
    };

    useEffect(() => {
        if (UserLoginId && loginUserData) {
            Get_CHATINTAKEFORM_UserData(UserLoginId)
        }
    }, [UserLoginId, loginUserData])

    const Get_CHATINTAKEFORM_UserData = async () => {
        try {
            if (!UserLoginId) {
                if (loginUserData) setEditval([loginUserData]);
                return;
            }
            const val = { UserID: UserLoginId, IsActive: "1" };
            const res = await postWithToken("CHATINTAKEFORM/GetData_CHATINTAKEFORM", val);

            if (res?.length > 0) {
                setEditval(res);
            } else if (loginUserData) {
                setEditval([loginUserData]);
            } else {
                setEditval([]);
            }
        } catch (error) {
            console.error("Error fetching chat intake form data:", error);
            if (loginUserData) setEditval([loginUserData]);
        }
    };

    const UpDate_CHATINTAKEFORM_Data = async () => {
        try {
            const { UserID, Name, NickName, DOB, TOB, POB, Gender, Occupation, Marital, TopicofConcern, ModifiedByUser, } = value;
            const val = {
                UserID: UserLoginId,
                Name: NickName,
                DOB: DOB,
                TOB: TOB,
                POB: POB,
                Gender: Gender,
                Occupation: Occupation,
                Marital: Marital,
                TopicofConcern: TopicofConcern,
                ChatUserBioID: ChatUserBioID,
                ModifiedByUser: '1',
                latitude: value?.latitude,
                longitude: value?.longitude,
            };
            const res = await postWithToken('CHATINTAKEFORM/Update_CHATINTAKEFORM', val)
            if (res) {
                Get_CHATINTAKEFORM_UserData()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const button2Ref = useRef(null);

    const handleClickButton1 = () => {
        button2Ref.current.focus();
    };

    const reset = () => {
        setValue({
            UserID: '', NickName: '', Name: '', DOB: '', TOB: '', POB: '', Gender: '', Occupation: '', Marital: '', TopicofConcern: '', CreatedByUser: '', longitude: '', latitude: ''
        });
        setErrors({});
    };

    const HandleNewDetails = () => {
        reset();
        setChatUserBioID(null);
    };

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (value.POB) {
            fetchLocationData(value.POB, true);
        }
    }, [value.POB]);

    const fetchLocationData = async (place, isInitial = false) => {
        try {
            const val = { address: place };
            const response = await postWithToken("Location/GetLocation", val);
            if (response?.length > 0) {
                if (isInitial) {
                    // Handle initial load if needed
                } else {
                    setSuggestions(response);
                    setShowSuggestions(true);
                }
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    // Utility functions
    const parseTobStringToDate = (tobString) => {
        if (!tobString) return null;
        try {
            const [time, period] = tobString.split(' ');
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            if (period === 'PM' && hour !== 12) hour += 12;
            if (period === 'AM' && hour === 12) hour = 0;
            const date = new Date();
            date.setHours(hour, parseInt(minutes), 0, 0);
            return date;
        } catch (error) {
            console.error('Error parsing TOB:', error);
            return null;
        }
    };

    const formatTobValue = (date) => {
        if (!date) return '';
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const AddType = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" },
    ]

    const OccupationType = [
        { value: "Student", label: "Student" },
        { value: "Engineer", label: "Engineer" },
        { value: "Doctor", label: "Doctor" },
        { value: "Artist", label: "Artist" },
        { value: "Other", label: "Other" },
    ]

    const MaritalType = [
        { value: "Single", label: "Single" },
        { value: "Married", label: "Married" },
        { value: "Divorced", label: "Divorced" },
        { value: "Widowed", label: "Widowed" },
    ]

    const TopicofConcernType = [
        { value: "Career", label: "Career" },
        { value: "Health", label: "Health" },
        { value: "Relationships", label: "Relationships" },
        { value: "Finance", label: "Finance" },
        { value: "Other", label: "Other" },
    ]

    return (
        <>
            <div className='py-20'>
                <div className="max-w-6xl mx-auto bg-orange-50 rounded-2xl border-2 border-orange-300 shadow-md">
                    <form className="p-8 rounded-lg" onSubmit={handleSubmit}>
                        <h2 className="text-3xl text-center text-gray-700 font-semibold mb-6">
                            Enter Details to Continue
                        </h2>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">

                            {/* Name */}
                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Name: <span className="text-red-600 ml-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="NickName"
                                    autoComplete='Off'
                                    value={value.NickName}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 mt-2"
                                    placeholder="Enter name"
                                />
                                {errors.NickName && (
                                    <p className="text-red-600 text-sm mt-1">{errors.NickName}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Date of Birth: <span className="text-red-600 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="DOB"
                                    value={value.DOB}
                                    onChange={handleChange}
                                    className="border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 mt-2"
                                />
                                {errors.DOB && (
                                    <p className="text-red-600 text-sm mt-1">{errors.DOB}</p>
                                )}
                            </div>

                            {/* Time of Birth */}
                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Time of Birth: <span className="text-red-600 ml-1">*</span>
                                </label>

                                <DatePicker
                                    id="TOB"
                                    name="TOB"
                                    selected={TOB}
                                    dateFormat="h:mm aa"
                                    autoComplete='Off'
                                    onChange={(date) => {
                                        setTOB(date);
                                        setValue({
                                            ...value,
                                            TOB: date ? formatTobValue(date) : "",
                                        });
                                    }}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={10}
                                    timeCaption="Time"
                                    placeholderText={TOB ? formatTobValue(TOB) : "Select..."}
                                    isClearable={!!TOB}
                                    className="w-full border border-gray-300 p-3 rounded-md focus:ring-2 focus:ring-indigo-500 mt-2 text-black placeholder-gray-500 bg-white"
                                />

                                {errors?.TOB && (
                                    <p className="text-red-600 text-sm mt-1">{errors.TOB}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Birth Place: <span className="text-red-600 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="POB"
                                        placeholder="Birth Place"
                                        value={value.POB}
                                        autoComplete='Off'
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setValue((prev) => ({ ...prev, POB: val, latitude: "", longitude: "" }));

                                            if (val.length >= 3) {
                                                fetchLocationData(val, false);
                                            } else {
                                                setSuggestions([]);
                                                setShowSuggestions(false);
                                            }
                                        }}

                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryColor"
                                    />

                                    {errors?.POB && (<p className="text-red-600 text-sm mt-1">{errors?.POB}</p>)}

                                    {showSuggestions && suggestions?.length > 0 && (
                                        <ul className="border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto bg-white z-10 absolute">
                                            {suggestions?.map((item, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => {
                                                        setValue((prev) => ({
                                                            ...prev,
                                                            POB: item.display_name,
                                                            latitude: item.lat,
                                                            longitude: item.lon,
                                                        }));
                                                        setSuggestions([]);
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="p-2 cursor-pointer hover:bg-gray-100"
                                                >
                                                    {item.display_name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Gender: <span className="text-red-600 ml-01">*</span>
                                </label>

                                <Select
                                    name="Gender"
                                    options={AddType}
                                    isClearable
                                    placeholder="Gender..."
                                    value={AddType?.filter((obj) => obj.value === value?.Gender)}
                                    onChange={(selectedOption) => {
                                        setValue({ ...value, Gender: selectedOption ? selectedOption.value : '' });
                                    }}
                                />
                                {errors.Gender && (
                                    <p className="text-red-600 text-sm mt-1">{errors.Gender}</p>
                                )}
                            </div>

                            {/* Occupation */}
                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Occupation:<span className="text-red-600 ml-1">*</span>
                                </label>

                                <Select
                                    name="Occupation"
                                    options={OccupationType}
                                    isClearable
                                    placeholder="Occupation..."
                                    value={OccupationType?.filter((obj) => obj.value === value?.Occupation)}
                                    onChange={(selectedOption) => {
                                        setValue({ ...value, Occupation: selectedOption ? selectedOption.value : '' });
                                    }}
                                />
                                {errors.Occupation && (
                                    <p className="text-red-600 text-sm mt-1">{errors.Occupation}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Marital Status:<span className="text-red-600 ml-1">*</span>
                                </label>

                                <Select
                                    name="Marital"
                                    options={MaritalType}
                                    isClearable
                                    placeholder="Marital Status..."
                                    value={MaritalType?.filter((obj) => obj.value === value?.Marital)}
                                    onChange={(selectedOption) => {
                                        setValue({ ...value, Marital: selectedOption ? selectedOption.value : '' });
                                    }}
                                />
                                {errors.Marital && (
                                    <p className="text-red-600 text-sm mt-1">{errors.Marital}</p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label className="flex text-gray-700 text-lg font-medium items-center">
                                    Topic of Concern:<span className="text-red-600 ml-1">*</span>
                                </label>

                                <Select
                                    name="TopicofConcern"
                                    options={TopicofConcernType}
                                    isClearable
                                    placeholder="Topic Of Concern..."
                                    value={TopicofConcernType?.filter((obj) => obj.value === value?.TopicofConcern)}
                                    onChange={(selectedOption) => {
                                        setValue({ ...value, TopicofConcern: selectedOption ? selectedOption.value : '' });
                                    }}
                                />
                                {errors.TopicofConcern && (
                                    <p className="text-red-600 text-sm mt-1">{errors.TopicofConcern}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
                            <button
                                type="submit"
                                ref={button2Ref}
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className={`font-semibold px-6 py-3 rounded-xl shadow-md w-[250px] transition-all duration-200  ${isLoading
                                    ? "bg-gray-400 cursor-not-allowed text-white"
                                    : "bg-orange-500 hover:bg-orange-600 text-white"} `}
                            >
                                {Type === "chat" ? "Start Chat with Astrologer" : "Start Call with Astrologer"}
                            </button>
                        </div>
                    </form>
                </div>

                <div>
                    {
                        isOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                {astrodata?.map((card, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg p-6 shadow-lg w-80 text-center"
                                    >
                                        {card?.AvatarUrl ? (
                                            <Image
                                                src={card?.AvatarUrl ? `https://${card?.AvatarUrl.replace(/\\/g, "/")}` : ''}
                                                alt="User"
                                                className="w-20 h-20 rounded-full mx-auto"
                                            />
                                        ) : (
                                            <Image src="/images/profile pic.webp" alt="User" className="w-20 h-20 rounded-full mx-auto" />
                                        )}

                                        <h2 className="text-xl font-semibold mt-2">{card?.DisplayName}</h2>
                                        <p className="text-sm text-red-600 mt-2">
                                            If you join the waitlist, we will notify {card?.DisplayName} to take the session, if possible.
                                        </p>
                                        <div className="mt-4 flex gap-4">
                                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg w-full hover:bg-orange-600" onClick={() => { InsertWaitingList(); setIsOpen(false); setWaitingListAdd(true) }}>
                                                Join Waitlist
                                            </button>
                                            <button
                                                className="bg-gray-300 text-black px-4 py-2 rounded-lg w-full hover:bg-gray-400"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>

            <>
                {
                    WaitingListAdd && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm w-full relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                    onClick={() => { setWaitingListAdd(false); router.push('/chat-to-astrologers') }}
                                >
                                    <p className='p-2'>X</p>
                                </button>

                                <h2 className="text-lg font-semibold text-center">Waitlist Joined!</h2>

                                <div className="flex items-center justify-center space-x-4 mt-4">
                                    <div className="flex flex-col items-center">
                                        {
                                            loginUserData?.ProfilePic ?
                                                <Image
                                                    src={loginUserData?.ProfilePic ? `https://${loginUserData?.ProfilePic?.replace(/\\/g, "/")}` : ''}
                                                    alt="User"
                                                    className="w-12 h-12 rounded-full border"
                                                />
                                                :
                                                <Image
                                                    src="/images/profile pic.webp"
                                                    alt="User"
                                                    className="w-12 h-12 rounded-full border"
                                                />
                                        }
                                        <p className="text-sm">{loginUserData?.FirstName} {loginUserData?.LastName}</p>
                                    </div>
                                    <IoCloudOffline />

                                    <div className="flex flex-col items-center">
                                        {
                                            astroimage ?
                                                <Image
                                                    src={astroimage ? `https://${astroimage?.replace(/\\/g, "/")}` : ''}
                                                    alt="User"
                                                    className="w-12 h-12 rounded-full border"
                                                />
                                                :
                                                <Image
                                                    src="/images/profile pic.webp"
                                                    alt="User"
                                                    className="w-12 h-12 rounded-full border"
                                                />
                                        }
                                        <p className="text-sm font-semibold">{astroname}</p>
                                    </div>
                                </div>

                                <p className="text-center text-red-500 font-semibold mt-2">{astroname} is Offline</p>
                                <p className="text-center text-gray-600 text-sm mt-1">
                                    Your chat will start when Astrologer is online
                                </p>
                            </div>
                        </div>
                    )
                }
            </>
        </>
    );
};

export default UserChatHome;
