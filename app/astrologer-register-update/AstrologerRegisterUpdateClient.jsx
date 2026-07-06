"use client";
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPostData, postWithToken, TokenImageUpload, TokenWithDeleteUpadateAdd } from '@/app/utils/api';
import OTPInput from 'react-otp-input';
import { toastifyError, toastifySuccess } from '@/app/utils/utility';
import Image from 'next/image';
import axios from 'axios';
import Select from 'react-select';
import { useMenuContext } from '@/app/hooks/useMenuContext';

const AstroRegisterUpdate = () => {
    const auth = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("LoginTokenData") || "{}") : {};
    const { Get_SingleData_Astrologer, loginAstrologerData, setLoginAstrologerData } = useMenuContext();

    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [Genderstatus, setGenderstatus] = useState("Male");
    const [Maritalstatus, setMaritalstatus] = useState("Unmarried");
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState();
    const [SkillsData, setSkillsData] = useState();
    const [LanguagesData, setLanguagesData] = useState();
    const [CategoryData, setCategoryData] = useState();
    const [value, setValue] = useState({
        'FirstName': '', 'LastName': '', 'EmailID': '', 'RegMobileNo': '', 'PrimaryMobileNo': '', 'SecondaryMobileNo': '', 'DOB': '', 'TOB': '', 'POB': '',
        'Faith': '', 'Languages': '', 'skills': '', 'ExperiencedYears': '', 'Maritalstatus': '', 'Gender': '', 'AadharNo': '', 'PANCardNo': '', 'CurrentAddress': '',
        'City': '', 'OtherPlatform': '', 'ContributeHoursDay': '', 'SourceBussiness': '', 'Aboutme': '', 'AstrologerID': '', 'DregeeDiploma': '', 'ModifiedByUser': '',
        'IsMobile': '', 'IsHomePage': '', "CategoryID": '', "State": ''
    });

    // console.log(value, 'value');

    const [PopupStatus, setPopupStatus] = useState(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const [img, setimg] = useState({
        AstrologerID: '',
        ModifiedByUser: '',
        file: '',
    });

    const handleChangeupdate = (e) => {
        const { name, value: val } = e.target;
        setValue((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const reset = () => {
        setValue({
            ...value,
            'FirstName': '', 'LastName': '', 'EmailID': '', 'RegMobileNo': '', 'PrimaryMobileNo': '', 'SecondaryMobileNo': '', 'DOB': '', 'TOB': '', 'POB': '',
            'Faith': '', 'Languages': '', 'skills': '', 'ExperiencedYears': '', 'Maritalstatus': '', 'Gender': '', 'AadharNo': '', 'PANCardNo': '', 'CurrentAddress': '',
            'City': '', 'OtherPlatform': '', 'ContributeHoursDay': '', 'SourceBussiness': '', 'Aboutme': '', 'AstrologerID': '', 'DregeeDiploma': '', 'ModifiedByUser': '',
            'IsMobile': '', 'IsHomePage': '', "CategoryID": '', "State": ''
        });
    };

    const UpdatecheckValidationErrors = () => {
        const newErrors = {};
        if (!value?.FirstName) {
            newErrors.FirstName = 'required *';
        }
        if (!value?.DOB) {
            newErrors.DOB = 'required *';
        }
        if (!value?.POB) {
            newErrors.POB = "Required *";
        } 
        // else if (value?.POB?.length <= 3) {
        //     newErrors.POB = "Must be more than 3 characters";
        // } else if (!longitudedata || !latitudedata) {
        //     newErrors.POB = "Please select a valid Birth Place from the list.";
        // }
        if (!value?.City) {
            newErrors.City = 'required *';
        }
        if (!value?.skills?.length) {
            newErrors.skills = 'required *';
        }
        if (!value?.TOB) {
            newErrors.TOB = 'required *';
        }
        if (!value?.Aboutme) {
            newErrors.Aboutme = 'required *';
        }
        if (!value?.Languages?.length) {
            newErrors.Languages = 'required *';
        }
        // if (!value?.PANCardNo) {
        //     newErrors.PANCardNo = 'required *';
        // }
        if (!value?.ExperiencedYears) {
            newErrors.ExperiencedYears = 'required *';
        }
        if (!value?.AadharNo) {
            newErrors.AadharNo = 'required *';
        }
        if (!value?.CategoryID) {
            newErrors.CategoryID = 'required *';
        }
        if (!value?.LastName) {
            newErrors.LastName = 'required *';
        }
        if (!value?.EmailID) {
            newErrors.EmailID = 'required *';
        } else if (!emailRegex.test(value.EmailID)) {
            newErrors.EmailID = "Invalid email address *";
        }
        setErrors(newErrors);
        if (Object?.keys(newErrors)?.length == 0) {
            Update_Astrologer_Data();
            // console.log("Update_Astrologer_Data");
        }
    };

    const onChangeRadioGender = (elements) => {
        setGenderstatus(elements?.target.value);
    };

    const onChangeRadioMarital = (elements) => {
        setMaritalstatus(elements?.target.value);
    };

    useEffect(() => {
        if (PopupStatus) {
            const timer = setTimeout(() => {
                setPopupStatus(false);
                router.push("/");
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                }
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [PopupStatus]);

    const Update_Astrologer_Data = async () => {
        try {
            const { DOB, TOB, POB, ExperiencedYears, AadharNo, PANCardNo, CurrentAddress, City, Aboutme, DregeeDiploma, ModifiedByUser, IsMobile, IsHomePage } = value;

            const val = {
                'DOB': DOB, 'TOB': TOB, 'POB': POB, 'ExperiencedYears': ExperiencedYears, 'Maritalstatus': Maritalstatus, 'Gender': Genderstatus, 'AadharNo': AadharNo, 'PANCardNo': PANCardNo, 'CurrentAddress': CurrentAddress, 'City': City, 'Aboutme': Aboutme, 'AstrologerID': auth?.Astro, 'DregeeDiploma': DregeeDiploma, 'ModifiedByUser': ModifiedByUser,
                'IsMobile': IsMobile, 'IsHomePage': IsHomePage,
                skills: Array.isArray(value.skills) ? value.skills.join(',') : '',
                Languages: Array.isArray(value.Languages) ? value.Languages.join(',') : '',
                CategoryID: Array.isArray(value.CategoryID) ? value.CategoryID.join(',') : '',
            };
            
            const res = await TokenWithDeleteUpadateAdd('Astrologer/Update_Astrologer', val);
            if (res) {
                reset();
                setPopupStatus(true);
            }
            console.log(res, 'resupdate');
        } catch (error) {
            console.log(error);
        }
    };

    const HandleChangeInput = (e) => {
        if (e.target.name === 'ExperiencedYears') {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setValue({
                ...value,
                [e.target.name]: ele
            });
        } else if (e.target.name === 'AadharNo') {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setValue({
                ...value,
                [e.target.name]: ele
            });
        } else if (e.target.name === 'PANCardNo') {
            let ele = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
            setValue({
                ...value,
                [e.target.name]: ele
            });
        } else if (e.target.name === 'RegMobileNo') {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setValue({ ...value, [e.target.name]: ele });
        } else if (e.target.name === 'EmailID') {
            let ele = e.target.value.replace(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{4,}$/, "");
            setValue({ ...value, [e.target.name]: ele });
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        const allowedExtensions = /(\.apng|\.png|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp)$/i;
        
        if (file) {
            if (!allowedExtensions.exec(file?.name)) {
                setFile(file);
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // update Img with api
            const formData = new FormData();
            const dataObject = {
                AstrologerID: auth?.Astro,
                ModifiedByUser: "1",
                file: "",
            };
            formData.append("Data", JSON.stringify(dataObject));
            formData.append("File", file);
            await TokenImageUpload("Astrologer/UpdateAstrologerPhoto", formData);
        }
    };

    const GetDropDownData_Skills = useCallback(async () => {
        const val = { 'IsActive': 'true' };
        try {
            const res = await getPostData('lstSkills/GetData_Skills', val);
            if (res) {
                setSkillsData(res?.map(item => ({
                    value: item?.SkillsID,
                    label: item?.Description
                })));
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const GetDropDownData_lstLanguages = useCallback(async () => {
        const val = { 'IsActive': 'true' };
        try {
            const res = await getPostData('lstLanguages/GetData_Languages', val);
            if (res) {
                setLanguagesData(res?.map(item => ({
                    value: item?.LanguagesID,
                    label: item?.Description
                })));
            }
        } catch (error) {
            console.log(error);
        }
    }, []);

    const GetDropDownData_AstrologersCategory = useCallback(async () => {
        try {
            const res = await axios.get('https://liveapi.astrocall.live/api/AstrologersCategory/GetDropDownData_AstrologersCategory');
            const { data } = res;
            const parsedData = JSON.parse(data?.data);
            const categoryList = parsedData?.Table;
            if (categoryList) {
                setCategoryData(categoryList?.map(item => ({
                    value: item?.CategoryID,
                    label: item?.Description
                })));
            }
        } catch (error) {
            console.error("Dropdown category fetch error:", error);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            GetDropDownData_Skills();
            GetDropDownData_lstLanguages();
            GetDropDownData_AstrologersCategory();
        }, 0);
        return () => clearTimeout(timer);
    }, [GetDropDownData_Skills, GetDropDownData_lstLanguages, GetDropDownData_AstrologersCategory]);

    const ChangeDropDown = (selectedOptions, name) => {
        if (Array.isArray(selectedOptions)) {
            setValue((prev) => ({
                ...prev,
                [name]: selectedOptions.map((option) => option.value),
            }));
        } else {
            setValue((prev) => ({
                ...prev,
                [name]: [],
            }));
        }
    };

    useEffect(() => {
        if (auth?.Astro) {
            Get_SingleData_Astrologer(auth?.Astro);
        }
    }, [auth?.Astro]);

    useEffect(() => {
        if (loginAstrologerData) {
            const timer = setTimeout(() => {
                setValue({
                    ...value,
                    FirstName: loginAstrologerData?.FirstName,
                    LastName: loginAstrologerData?.LastName,
                    EmailID: loginAstrologerData?.EmailID,
                    RegMobileNo: loginAstrologerData?.RegMobileNo,
                });
            }, 0);
            return () => clearTimeout(timer);
        }
        const timer = setTimeout(() => {
            setValue({
                ...value,
                FirstName: "",
                LastName: "",
                EmailID: "",
                RegMobileNo: "",
            });
        }, 0);
        return () => clearTimeout(timer);
    }, [loginAstrologerData]);

    const [Locationdata, setLocationdata] = useState("");
    const [longitudedata, setlongitudedata] = useState('');
    const [latitudedata, setlatitudedata] = useState('');
    const [length, setLength] = useState(null);

    const url = typeof window !== 'undefined' ? window.location.origin : '';

    const Get_Data_Location = useCallback(async () => {
        const val = { 'address': value?.POB };
        try {
            const res = await postWithToken('Location/GetLocation', val);
            if (res) {
                setLocationdata(res?.filter((item) => item?.display_name));
            }
        } catch (error) {
            console.log(error);
        }
    }, [value.POB]);

    useEffect(() => {
        if (!(length > 3)) return;
        const timer = setTimeout(() => {
            Get_Data_Location();
        }, 500);
        return () => clearTimeout(timer);
    }, [length, Get_Data_Location]);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setValue({ ...value, [e.target.name]: inputValue });

        if (typeof inputValue === "string") {
            setLength(inputValue.length);
            if (inputValue?.length === 0) {
                setLocationdata([]);
                setlatitudedata('');
                setlongitudedata('');
            }
        } else {
            setLength(null);
        }
    };

    const handleSelect = async (description) => {
        setValue({ ...value, POB: description });
        setLocationdata([]);
        try {
            // const results = await getGeocode({ address: description });
            // const { lat, lng } = await getLatLng(results[0]);
            // setSelectedLocation({ lat, lng });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
           
            <div className='main-container'>
                <div className="mb-40 bg-white">
                    <div className='mt-20'>
                        <div className="bg-orange-50 p-6 sellerCard box-seller rounded-lg flex flex-col w-full">
                            <div>
                                <div className="text-center mb-8 font-[600]">
                                    <h1>Personal Info</h1>
                                </div>

                                <div className="text-center mb-20">
                                    <label htmlFor="file">
                                        {imagePreview || img?.file ? (
                                            <img
                                                src={imagePreview ? imagePreview : `https://${img?.file?.replace(/\\/g, "/")}`}
                                                className="w-[90px] h-[90px]"
                                                alt={file ? file.name : "User Avatar"}
                                                style={{ borderRadius: "50px" }}
                                            />
                                        ) : (
                                            <div
                                                className="profile-placeholder"
                                                style={{
                                                    justifyContent: "center", margin: "auto", alignItems: "center", textAlign: "center", border: "1px solid #ff6600", display: "flex", flexDirection: "column",
                                                }}
                                            >
                                                <i className="fas fa-upload" style={{ fontSize: "24px", color: "#ff6600" }}></i>
                                                <span style={{ color: "#ff6600" }}>
                                                    Upload
                                                </span>
                                            </div>
                                        )}
                                    </label>
                                    <input type="file" id="file" name="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                                </div>

                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    <div>
                                        <label htmlFor="FirstName" className="block text-sm font-medium">
                                            First Name*
                                        </label>
                                        <input type="text" name="FirstName" id="FirstName" placeholder="First Name" className="mt-1 block w-full border rounded-md p-2" onChange={handleChangeupdate} value={value.FirstName} />
                                        {errors.FirstName && <p className="text-red-500 text-xs">{errors?.FirstName}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="LastName" className="block text-sm font-medium">
                                            Last Name*
                                        </label>
                                        <input type="text" name="LastName" id="LastName" placeholder="Last Name" className="mt-1 block w-full border rounded-md p-2" onChange={handleChangeupdate} value={value.LastName} />
                                        {errors.LastName && <p className="text-red-500 text-xs">{errors?.LastName}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="EmailID" className="block text-sm font-medium">
                                            Email Address*
                                        </label>
                                        <input type="text" name="EmailID" id="EmailID" placeholder='Enter Email' className="mt-1 block w-full border rounded-md p-2" onChange={handleChangeupdate} value={value.EmailID} />
                                        {errors.EmailID && <p className="text-red-500 text-xs">{errors?.EmailID}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="RegMobileNo" className="block text-sm font-medium">
                                            Reg Mobile No*
                                        </label>
                                        <input type="text" name="RegMobileNo" id="RegMobileNo" readOnly placeholder='Reg Mobile No' className="mt-1 block w-full border rounded-md p-2" onChange={handleChangeupdate} value={value.RegMobileNo} />
                                        {errors.RegMobileNo && <p className="text-red-500 text-xs">{errors?.RegMobileNo}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="DOB" className="block text-sm font-medium">Date of Birth</label>
                                        <input type="date" name="DOB" placeholder="DOB" className="mt-1 block w-full border rounded-md p-2" id="DOB" onChange={handleChangeupdate} value={value?.DOB} />
                                        {errors?.DOB && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.DOB}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="TOB" className="block text-sm font-medium">Time of Birth</label>
                                        <input type="time" name="TOB" placeholder="TOB" className="mt-1 block w-full border rounded-md p-2" id="TOB" onChange={handleChangeupdate} value={value?.TOB} />
                                        {errors?.TOB && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.TOB}</p>}
                                    </div>

                                    <div className="relative">
                                        <label htmlFor="POB" className="block text-sm font-medium">Birth Place</label>
                                        <input
                                            id="POB"
                                            name="POB"
                                            placeholder="Birth Place"
                                            className="mt-1 block w-full border rounded-md p-2"
                                            autoComplete="off"
                                            value={value?.POB}
                                            onChange={handleInputChange}
                                        />

                                        {errors?.POB && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.POB}</p>}

                                        {Locationdata?.length > 0 && (
                                            <div className="absolute left-0 right-0 mt-2 bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden z-50 max-h-72 overflow-y-auto">
                                                {Locationdata?.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className={`px-4 py-3 hover:bg-orange-50 cursor-pointer text-sm text-gray-700 border-b last:border-b-0`}
                                                        onMouseDown={() => {
                                                            handleSelect(item?.display_name);
                                                            setlongitudedata(item?.lon);
                                                            setlatitudedata(item?.lat);
                                                        }}
                                                    >
                                                        <p className="font-medium">{item?.display_name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="City" className="block text-sm font-medium">Current City* </label>
                                        <input type="text" name="City" placeholder="City" className="mt-1 block w-full border rounded-md p-2" onChange={handleChangeupdate} value={value?.City} />
                                        {errors?.City && <p className="text-red-500 text-xs">{errors?.City}</p>}
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Gender :</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center space-x-2">
                                                <input type="radio" name="Gender" value="Male" id="male" checked={Genderstatus === "Male"} onChange={onChangeRadioGender}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                <span className="text-gray-700">Male</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input type="radio" name="Gender" value="Female" id="female" checked={Genderstatus === "Female"} onChange={onChangeRadioGender}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                <span className="text-gray-700">Female</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="ExperiencedYears" className="block text-sm font-medium">Experience in Year</label>
                                        <input type="text" name="ExperiencedYears" placeholder="ExperiencedYears" maxLength={2}
                                            className="mt-1 block w-full border rounded-md p-2" id="ExperiencedYears" onChange={HandleChangeInput} value={value.ExperiencedYears} />
                                        {errors?.ExperiencedYears && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.ExperiencedYears}</p>}
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Marital Status:</label>
                                        <div className="flex items-center space-x-4">
                                            <label className="flex items-center space-x-2">
                                                <input type="radio" name="MaritalStatus" value="Unmarried" checked={Maritalstatus === "Unmarried"} onChange={onChangeRadioMarital}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                <span className="text-gray-700">Unmarried</span>
                                            </label>
                                            <label className="flex items-center space-x-2">
                                                <input type="radio" name="MaritalStatus" value="Married" checked={Maritalstatus === "Married"} onChange={onChangeRadioMarital}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                <span className="text-gray-700">Married</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="skills" className="block text-sm font-medium">Skills* </label>
                                        <Select
                                            name="skills"
                                            options={SkillsData}
                                            isMulti
                                            value={SkillsData?.filter((obj) => value?.skills?.includes(obj.value))}
                                            onChange={(e) => ChangeDropDown(e, 'skills')}
                                            placeholder="Select..."
                                        />
                                        {errors?.skills && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.skills}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="CategoryID" className="block text-sm font-medium">Category* </label>
                                        <Select
                                            name="CategoryID"
                                            options={CategoryData}
                                            isMulti
                                            value={CategoryData?.filter((obj) => value?.CategoryID?.includes(obj.value))}
                                            onChange={(e) => ChangeDropDown(e, 'CategoryID')}
                                            placeholder="Select..."
                                        />
                                        {errors?.CategoryID && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.CategoryID}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="Languages" className="block text-sm font-medium">Language* </label>
                                        <Select
                                            name="Languages"
                                            options={LanguagesData}
                                            isMulti
                                            value={LanguagesData?.filter((obj) => value?.Languages?.includes(obj.value))}
                                            onChange={(e) => ChangeDropDown(e, 'Languages')}
                                            placeholder="Select..."
                                        />
                                        {errors?.Languages && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.Languages}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="AadharNo" className="block text-sm font-medium">Aadhar No* </label>
                                        <input type="text" name="AadharNo" placeholder="AadharNo" className="mt-1 block w-full border rounded-md p-2" maxLength={12}
                                            onChange={HandleChangeInput} value={value.AadharNo} />
                                        {errors?.AadharNo && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.AadharNo}</p>}
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-4 mt-5 col-span-2">
                                        <label htmlFor="Aboutme" className="block text-sm font-medium">About My Services*</label>
                                        <textarea
                                            name="Aboutme"
                                            rows={3}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                            id="Aboutme"
                                            required
                                            onChange={handleChangeupdate}
                                            value={value.Aboutme}
                                        ></textarea>
                                        <p style={{ fontSize: '12px' }}>Minimum 150 and Maximum 1000 characters allowed</p>
                                        {errors?.Aboutme && <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }} className="error-message">{errors?.Aboutme}</p>}
                                    </div>
                                </div>

                                <div className='py-8'>
                                    <center>
                                        <button
                                            type="submit"
                                            className="bg-primaryColor p-2 block w-[200px] shadow-md rounded-xl hover:scale-105 duration-300 hover:bg-primaryColor text-white mt-4"
                                            onClick={() => { UpdatecheckValidationErrors() }}
                                        >
                                            Update Profile
                                        </button>
                                    </center>
                                </div>
                            </div>

                            {PopupStatus && (
                                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-fade-in-up border-t-4 border-orange-500">
                                        {/* Logo & Branding */}
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <Image
                                                src="/images/logo1.webp"
                                                alt="AstroCall"
                                                width={40}
                                                height={40}
                                                className="object-contain"
                                            />
                                            <h2 className="text-xl font-bold text-orange-600">AstroCall</h2>
                                        </div>

                                        {/* Success Icon */}
                                        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>

                                        {/* Message */}
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Thank You!</h3>
                                        <p className="text-sm text-gray-600">
                                            Your information has been successfully submitted on <span className="font-medium text-orange-600">AstroCall</span>.
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Our team will contact you shortly. We look forward to connecting with you!
                                        </p>

                                        {/* Close Button */}
                                        <button
                                            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-all duration-300 shadow-sm"
                                            onClick={() => {
                                                setPopupStatus(false);
                                                router.push("/");
                                                if (typeof window !== 'undefined') {
                                                    localStorage.clear();
                                                }
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
           
        </>
    );
};

export default AstroRegisterUpdate;
