"use client";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getShowingDateText, getShowingMonthDateYear, toastifySuccess, } from "@/app/utils/utility";
import { LiaEditSolid } from "react-icons/lia";
import { BsShieldCheck } from "react-icons/bs";
import { GiIndiaGate, GiPalm, GiCardRandom } from "react-icons/gi";
// Sidebar is rendered by `app/astrologer-panel/layout.js`
import { FaCheck, FaIdCard, } from "react-icons/fa";
// Custom Modal Component
const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>);
};
// Mock MenuContext for Next.js
const MenuContext = React.createContext({
    Get_SingleData_Astrologer: () => { },
    loginAstrologerData: null,
    setLoginAstrologerData: () => { },
    LanguagesData: [],
    setLanguagesData: () => { },
    SkillsData: [],
    setSkillsData: () => { },
    GetDropDownData_lstLanguages: () => { },
    GetDropDownData_Skills: () => { },
});
const Profile = () => {
    const router = useRouter();
    const { Get_SingleData_Astrologer, loginAstrologerData, setLoginAstrologerData, LanguagesData, setLanguagesData, SkillsData, setSkillsData, } = useContext(MenuContext);
    const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId")
        ? localStorage.getItem("AstroLoginId")
        : "";
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState("Basic Details");
    const [DregeeDiplomaData, setDregeeDiplomaData] = useState();
    const [QualificationData, setQualificationData] = useState();
    const [Editval, setEditval] = useState();
    const [Genderstatus, setGenderstatus] = useState("Male");
    const [statusMarital, setstatusMarital] = useState("Married");
    const [file, setFile] = React.useState(null);
    const [DOB, setDOB] = useState();
    const [isOpen, setIsOpen] = useState(true);
    const [AadharfrontimgPreview, setAadharfrontimgPreview] = useState(null);
    const [AadharbackimgPreview, setAadharbackimgPreview] = useState(null);
    const [value, setvalue] = useState({
        FirstName: "",
        LastName: "",
        EmailID: "",
        RegMobileNo: "",
        PrimaryMobileNo: "",
        SecondaryMobileNo: "",
        DOB: "",
        TOB: "",
        POB: "",
        Faith: "",
        Languages: "",
        skills: "",
        ExperiencedYears: "",
        Maritalstatus: "",
        Gender: "",
        AadharNo: "",
        PANCardNo: "",
        CurrentAddress: "",
        City: "",
        OtherPlatform: "",
        ContributeHoursDay: "",
        SourceBussiness: "",
        Aboutme: "",
        AstrologerID: "",
        DregeeDiploma: "",
        ModifiedByUser: "1",
        IsMobile: "",
        IsHomePage: "",
        HighestQualification: "",
        WhereLearnAstrology: "",
        CollegeUniversity: "",
        PINCode: "",
        State: "",
    });
    // Mock data for development
    const [mockLoginData, setMockLoginData] = useState({
        FirstName: "John",
        LastName: "Doe",
        EmailID: "john@example.com",
        Gender: "Male",
        Maritalstatus: "Married",
        State: "Maharashtra",
        POB: "Mumbai",
        TOB: "10:30",
        DOB: "1990-01-15",
        CurrentAddress: "123 Main Street",
        RegMobileNo: "9876543210",
        PrimaryMobileNo: "9876543210",
        SecondaryMobileNo: "9876543211",
        Faith: "Hinduism",
        Languages: "Hindi,English",
        PINCode: "400001",
        skills: "Vedic Astrology,Numerology",
        ExperiencedYears: "10",
        AadharNo: "123456789012",
        PANCardNo: "ABCDE1234F",
        City: "Mumbai",
        OtherPlatform: "No",
        HighestQualification: "1",
        ContributeHoursDay: "8",
        SourceBussiness: "Online",
        Aboutme: "I am an experienced astrologer with 10 years of practice.",
        DregeeDiploma: "1",
        WhereLearnAstrology: "Self Learned",
        CollegeUniversity: "Mumbai University",
        IsVerified: "true",
        AvatarUrl: "",
        Aadhar_front_img: null,
        Aadhar_back_img: null,
    });
    const handleChange = (e) => {
        const { name, value: val } = e?.target;
        setvalue((prev) => ({ ...prev, [name]: val }));
    };
    const ChangeDropDown2 = (e, name) => {
        if (e && Array.isArray(e)) {
            setvalue({
                ...value,
                [name]: e.map((item) => item.label).join(", "),
            });
        }
        else if (e) {
            setvalue({
                ...value,
                [name]: e.label,
            });
        }
        else {
            setvalue({
                ...value,
                [name]: null,
            });
        }
    };
    const ChangeDropDown = (selectedOptions, name) => {
        if (Array.isArray(selectedOptions)) {
            setvalue((prev) => ({
                ...prev,
                [name]: selectedOptions.map((option) => option.value),
            }));
        }
        else {
            setvalue((prev) => ({
                ...prev,
                [name]: [],
            }));
        }
    };
    const onChangeRadioGender = (elements) => {
        setGenderstatus(elements?.target.value);
    };
    const onChangeRadioMarital = (elements) => {
        setstatusMarital(elements?.target.value);
    };
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };
    useEffect(() => {
        GetDropDownData_DregeeDiploma();
        GetDropDownData_Qualification();
        GetDropDownData_lstLanguages();
        GetDropDownData_Skills();
    }, []);
    useEffect(() => {
        // Use mock data for development
        const data = mockLoginData;
        setvalue({
            ...value,
            FirstName: data?.FirstName,
            LastName: data?.LastName,
            EmailID: data?.EmailID,
            Gender: data?.Gender,
            Maritalstatus: data?.Maritalstatus,
            State: data?.State,
            POB: data?.POB,
            TOB: data?.TOB,
            CurrentAddress: data?.CurrentAddress,
            RegMobileNo: data?.RegMobileNo,
            PrimaryMobileNo: data?.PrimaryMobileNo,
            SecondaryMobileNo: data?.SecondaryMobileNo,
            Faith: data?.Faith,
            Languages: data?.Languages,
            PINCode: data?.PINCode,
            skills: data?.skills,
            ExperiencedYears: data?.ExperiencedYears,
            AadharNo: data?.AadharNo,
            PANCardNo: data?.PANCardNo,
            City: data?.City,
            OtherPlatform: data?.OtherPlatform,
            HighestQualification: data?.HighestQualification,
            ContributeHoursDay: data?.ContributeHoursDay,
            SourceBussiness: data?.SourceBussiness,
            Aboutme: data?.Aboutme,
            DregeeDiploma: data?.DregeeDiploma,
            WhereLearnAstrology: data?.WhereLearnAstrology,
            CollegeUniversity: data?.CollegeUniversity,
            DOB: data.DOB ? getShowingDateText(data.DOB) : "",
        });
    }, []);
    const HandleChangeInput = (e) => {
        if (e.target.name === "PINCode") {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setvalue({
                ...value,
                [e.target.name]: ele,
            });
        }
        else if (e.target.name === "AadharNo") {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setvalue({
                ...value,
                [e.target.name]: ele,
            });
        }
        else if (e.target.name === "PANCardNo") {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setvalue({
                ...value,
                [e.target.name]: ele,
            });
        }
        else if (e.target.name === "ExperiencedYears") {
            let ele = e.target.value.replace(/[^0-9]/g, "");
            setvalue({
                ...value,
                [e.target.name]: ele,
            });
        }
    };
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const BasicDetails_CheckValidationErrors = () => {
        const newErrors = {};
        if (!value?.FirstName) {
            newErrors.FirstName = "required *";
        }
        if (!value?.LastName) {
            newErrors.LastName = "required *";
        }
        if (!value?.RegMobileNo) {
            newErrors.RegMobileNo = "required *";
        }
        if (!value?.EmailID) {
            newErrors.EmailID = "required *";
        }
        else if (!emailRegex.test(value.EmailID)) {
            newErrors.EmailID = "Invalid email address *";
        }
        if (!value?.DOB) {
            newErrors.DOB = "required *";
        }
        if (!value?.TOB) {
            newErrors.TOB = "required *";
        }
        if (!value?.POB) {
            newErrors.POB = "required *";
        }
        if (!value?.CurrentAddress) {
            newErrors.CurrentAddress = "required *";
        }
        if (!value?.City) {
            newErrors.City = "required *";
        }
        if (!value?.PINCode) {
            newErrors.PINCode = "required *";
        }
        if (!value?.PANCardNo) {
            newErrors.PANCardNo = "pan is required *";
        }
        if (!value?.AadharNo) {
            newErrors.AadharNo = "required *";
        }
        setErrors(newErrors);
        if (Object?.keys(newErrors)?.length === 0) {
            Update_Astrologer_Data();
        }
    };
    const Update_Astrologer_Data = () => {
        const { FirstName, LastName, EmailID, RegMobileNo, DOB, TOB, POB, Faith, Maritalstatus, Gender, AadharNo, PANCardNo, CurrentAddress, City, State, PINCode, AstrologerID, } = value;
        const val = {
            FirstName: FirstName,
            LastName: LastName,
            EmailID: EmailID,
            RegMobileNo: RegMobileNo,
            DOB: DOB,
            TOB: TOB,
            POB: POB,
            Faith: Faith,
            Maritalstatus: statusMarital,
            Gender: Genderstatus,
            AadharNo: AadharNo,
            PANCardNo: PANCardNo,
            CurrentAddress: CurrentAddress,
            City: City,
            State: State,
            AstrologerID: GetAstroLoginId,
            ModifiedByUser: "1",
            PINCode: PINCode,
        };
        // Mock API call
        toastifySuccess("Successfully Update");
    };
    const Aboutme_CheckValidationErrors = () => {
        const newErrors = {};
        if (!value?.Aboutme) {
            newErrors.Aboutme = "required *";
        }
        if (!value?.ExperiencedYears) {
            newErrors.ExperiencedYears = "required *";
        }
        if (!value?.Languages?.length) {
            newErrors.Languages = "required *";
        }
        if (!value?.skills?.length) {
            newErrors.skills = "required *";
        }
        setErrors(newErrors);
        if (Object?.keys(newErrors)?.length === 0) {
            AboutMe_Update_Astrologer_Data();
        }
    };
    const Qualification_CheckValidationErrors = () => {
        const newErrors = {};
        if (!value?.HighestQualification) {
            newErrors.HighestQualification = "required *";
        }
        if (!value?.DregeeDiploma) {
            newErrors.DregeeDiploma = "required *";
        }
        if (!value?.CollegeUniversity) {
            newErrors.CollegeUniversity = "required *";
        }
        if (!value?.WhereLearnAstrology) {
            newErrors.WhereLearnAstrology = "required *";
        }
        setErrors(newErrors);
        if (Object?.keys(newErrors)?.length == 0) {
            Qualification_Update_Astrologer_Data();
        }
    };
    const formatArray = (input, keyName) => {
        if (Array.isArray(input))
            return input.join(",");
        if (typeof input === "string")
            return input;
        if (typeof input === "object" && input[keyName])
            return input[keyName];
        return "";
    };
    const AboutMe_Update_Astrologer_Data = () => {
        try {
            const { ExperiencedYears, Languages, skills, Aboutme } = value;
            const val = {
                skills: formatArray(skills, "skillsValue"),
                Languages: formatArray(Languages, "LanguagesValue"),
                ExperiencedYears,
                Aboutme,
                AstrologerID: GetAstroLoginId,
                ModifiedByUser: "1",
            };
            // Mock API call
            toastifySuccess("Successfully Updated");
        }
        catch (error) {
            console.error("❌ Error in AboutMe_Update_Astrologer_Data:", error);
        }
    };
    const ChangeDropDown3 = (selectedOption, fieldName) => {
        setvalue((prev) => ({
            ...prev,
            [fieldName]: selectedOption ? selectedOption.value : '',
        }));
    };
    const Qualification_Update_Astrologer_Data = () => {
        const { HighestQualification, DregeeDiploma, CollegeUniversity, WhereLearnAstrology } = value;
        const val = {
            HighestQualification,
            DregeeDiploma,
            CollegeUniversity,
            WhereLearnAstrology,
            AstrologerID: GetAstroLoginId,
            ModifiedByUser: "1",
        };
        // Mock API call
        toastifySuccess("Successfully Updated");
    };
    const [formDataAt, setFormDataAt] = useState({
        AstrologerID: GetAstroLoginId,
        ModifiedByUser: "",
        files: {
            frontImg: null,
            backImg: null,
        },
    });
    const handleChangeAttichement = (e) => {
        const { name, value: val, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            if (name === "frontImg") {
                setAadharfrontimgPreview(URL.createObjectURL(file));
            }
            else if (name === "backImg") {
                setAadharbackimgPreview(URL.createObjectURL(file));
            }
            setFormDataAt((prevState) => ({
                ...prevState,
                files: {
                    ...prevState.files,
                    [name]: file,
                },
            }));
        }
        else {
            setFormDataAt((prevState) => ({
                ...prevState,
                [name]: val,
            }));
        }
    };
    const updateAttachment = async (e) => {
        // Mock API call
        toastifySuccess("Successfully Update");
        setFormDataAt({
            AstrologerID: GetAstroLoginId,
            ModifiedByUser: "1",
            files: { frontImg: null, backImg: null },
        });
    };
    const handleUpdatePhoto = async () => {
        try {
            // Mock API call
            toastifySuccess("Successfully Upload");
        }
        catch (error) {
            console.log(error);
        }
    };
    const fileHandler = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setvalue((prevState) => ({
                ...prevState,
                Attachmenturl: file.name,
            }));
        }
    };
    const skills = [
        {
            name: "Vedic Astrology",
            level: "Expert",
            progress: 95,
            icon: <GiIndiaGate className="text-orange-600 text-xl"/>,
            color: "bg-yellow-200",
            labelColor: "text-green-700 bg-green-100",
        },
        {
            name: "Numerology",
            level: "Advanced",
            progress: 80,
            icon: <GiCardRandom className="text-blue-600 text-xl"/>,
            color: "bg-blue-200",
            labelColor: "text-blue-700 bg-blue-100",
        },
        {
            name: "Palmistry",
            level: "Intermediate",
            progress: 70,
            icon: <GiPalm className="text-green-600 text-xl"/>,
            color: "bg-green-200",
            labelColor: "text-orange-700 bg-orange-100",
        },
    ];
    const languages = [
        { name: "Hindi", level: "Native", stars: 5 },
        { name: "English", level: "Fluent", stars: 4 },
    ];
    const qualifications = [
        {
            title: "Diploma in Vedic Astrology",
            institute: "Bhartiya Vidya Bhavan",
            year: "2006 - 2008",
            verified: true,
        },
        {
            title: "Advanced Course in Numerology",
            institute: "Institute of Numerological Sciences",
            year: "2010",
            verified: false,
        },
    ];
    const [bankDetailsExpanded, setBankDetailsExpanded] = useState(true);
    const [documentsExpanded, setDocumentsExpanded] = useState(true);
    const [bankData, setBankData] = useState({
        accountHolderName: "Ajay Singh",
        bankName: "State Bank of India",
        accountNumber: "XXXX XXXX XXXX 5678",
        ifscCode: "SBIN0012345",
        accountType: "Savings",
        branch: "Andheri East",
    });
    const handleInputChange = (field, val) => {
        setBankData((prev) => ({
            ...prev,
            [field]: val,
        }));
    };
  
    const toggleAccordion = () => {
        setIsOpen((prev) => !prev);
    };
    const getImageUrl = (path) => {
        if (!path)
            return null;
        const cleanedPath = path.replace(/\\/g, "/");
        if (cleanedPath.includes("api.astrocall.live")) {
            return cleanedPath.startsWith("http")
                ? cleanedPath
                : `https://${cleanedPath}`;
        }
        return `https://api.astrocall.live/${cleanedPath}`;
    };
    // Mock dropdown data
    const mockLanguagesData = [
        { value: "1", label: "Hindi" },
        { value: "2", label: "English" },
        { value: "3", label: "Marathi" },
    ];
    const mockSkillsData = [
        { value: "1", label: "Vedic Astrology" },
        { value: "2", label: "Numerology" },
        { value: "3", label: "Palmistry" },
    ];
    const mockQualificationData = [
        { value: "1", label: "Graduate" },
        { value: "2", label: "Post Graduate" },
        { value: "3", label: "Diploma" },
    ];
    const GetDropDownData_DregeeDiploma = async () => {
        // Mock implementation
        setDregeeDiplomaData(mockQualificationData);
    };
    const GetDropDownData_Qualification = async () => {
        // Mock implementation
        setQualificationData(mockQualificationData);
    };
    const GetDropDownData_lstLanguages = async () => {
        // Mock implementation
        setLanguagesData(mockLanguagesData);
    };
    const GetDropDownData_Skills = async () => {
        // Mock implementation
        setSkillsData(mockSkillsData);
    };
    // Create a wrapper component for MenuContext
    const MenuProvider = ({ children }) => {
        const contextValue = {
            Get_SingleData_Astrologer: () => { },
            loginAstrologerData: mockLoginData,
            setLoginAstrologerData: setMockLoginData,
            LanguagesData: mockLanguagesData,
            setLanguagesData: () => { },
            SkillsData: mockSkillsData,
            setSkillsData: () => { },
            GetDropDownData_lstLanguages: GetDropDownData_lstLanguages,
            GetDropDownData_Skills: GetDropDownData_Skills,
        };
        return (<MenuContext.Provider value={contextValue}>
        {children}
      </MenuContext.Provider>);
    };
    return (<MenuProvider>
      <div className="flex-1 lg:ml-0">
          <div className="main-container d-flex justify-content-center w-full">
            <div className="">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                My Profile
              </h2>
              <p className="text-sm text-gray-500">
                Manage your astrology profile and settings
              </p>
            </div>
          </div>
          
          <div className="flex items-end w-full mb-6">
            {(mockLoginData?.IsVerified === "false" || mockLoginData?.IsVerified === false) ? (<div className="w-full bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow-md">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l1.41 1.41M12 2v2m7.07 2.93l1.41-1.41M20 12h2M2 12h2m2.93 7.07l-1.41 1.41M12 20v2m7.07-2.93l1.41 1.41"/>
                  </svg>
                  <div>
                    <p className="text-base font-semibold">Your Approval Request Is Pending.</p>
                    <p className="text-sm"> Please wait until the admin accepts your request.</p>
                  </div>
                </div>
              </div>) : ('')}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow__md__lists overflow-hidden">
            {/* Profile Info */}
            <div className="flex flex-row justify-between p-4 pb-6 w-full">
              {/* Left: Avatar and Name Block */}
              <div className="flex flex-row">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="relative mt-4 flex items-center justify-center">
                      <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img src={file
            ? URL.createObjectURL(file)
            : mockLoginData.AvatarUrl
                ? `https://${mockLoginData.AvatarUrl.replace(/\\/g, "/")}`
                : "/images/profile pic.webp"} alt="Profile" className="max-h-full max-w-full object-contain"/>
                      </div>
                    </div>

                    <label htmlFor="fileInput" className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
                      <LiaEditSolid size={20} className="text-orange-600"/>
                    </label>
                    <input type="file" id="fileInput" accept="image/*" onChange={fileHandler} className="hidden"/>
                  </div>

                  <button className="mt-4 px-4 py-1 text-sm font-medium text-white bg-orange-500 rounded shadow hover:bg-orange-600" onClick={handleUpdatePhoto}>
                    Upload Photo
                  </button>
                </div>

                <div className="ml-4 flex flex-col justify-center mt-4">
                  <h2 className="mt-3 text-lg font-bold text-gray-800">
                    {mockLoginData?.FirstName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {mockLoginData?.skills}
                  </p>
                </div>
              </div>

              {/* Right: Verified Badge */}
              <div className="flex items-end">
                {(mockLoginData?.IsVerified === "true" || mockLoginData?.IsVerified === true) ?
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <BsShieldCheck className="text-green-600"/>
                      Verified Expert
                    </span>
            : ''}
              </div>
            </div>
          </div>
        </div>

        <div className="main-container d-flex justify-content-center w-full">
          <div className="flex flex-col md:flex-row gap-5">
            <div className="w-full">
              <div className="contactForm shadow-lg rounded p-6 bg-white border-2 rounded-xl">

                <div className="flex flex-col md:flex-row flex-wrap gap-6">
                  {[
            "Basic Details",
            "About Me",
            "Qualification",
            "Bank Details",
            "Attachment",
        ].map((tab) => (<button key={tab} className={`flex items-center font-[600] lg:text-md hover:text-primaryColor ${activeTab === tab
                ? "text-primaryColor border-b-2 border-primaryColor"
                : ""}`} onClick={() => handleTabChange(tab)}>
                      {tab}
                    </button>))}
                </div>

                <div className="w-full h-[1px] bg-primaryColor mt-"></div>

                <div className="py-8">

                  {activeTab === "Basic Details" && (<>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="FirstName" className="block text-sm font-medium">
                            First Name*
                          </label>
                          <input type="text" name="FirstName" placeholder="First Name" className="mt-1 block w-full border rounded-md p-2" onChange={handleChange} value={value?.FirstName || ""}/>
                          {errors?.FirstName && (<p className="text-red-500 text-xs">
                              {errors?.FirstName}
                            </p>)}
                        </div>
                        <div>
                          <label htmlFor="LastName" className="block text-sm font-medium">
                            Last Name*
                          </label>
                          <input type="text" name="LastName" placeholder="Last Name" className="mt-1 block w-full border rounded-md p-2" onChange={handleChange} value={value?.LastName || ""}/>
                          {errors?.LastName && (<p className="text-red-500 text-xs">
                              {errors?.LastName}
                            </p>)}
                        </div>
                        <div>
                          <label htmlFor="MobileNo" className="block text-sm font-medium">
                            Reg Mobile No*
                          </label>
                          <input type="text" name="RegMobileNo" placeholder="RegMobileNo" className="mt-1 block w-full border rounded-md p-2" maxLength={10} value={value?.RegMobileNo || ""} readOnly/>
                          {errors?.RegMobileNo && (<p className="text-red-500 text-xs">
                              {errors?.RegMobileNo}
                            </p>)}
                        </div>
                        <div>
                          <label htmlFor="LastName" className="block text-sm font-medium">
                            Email*
                          </label>
                          <input type="EmailID" name="EmailID" placeholder="Email" className="mt-1 block w-full border rounded-md p-2" onChange={handleChange} value={value?.EmailID || ""}/>
                          {errors.EmailID && (<p className="text-red-500 text-xs">
                              {errors.EmailID}
                            </p>)}
                        </div>
                        <div className="flex gap-2">
                          <label className="block text-sm font-medium">
                            Gender
                          </label>
                          <input type="radio" name="Gender" value={"Male"} checked={Genderstatus == "Male"} onChange={onChangeRadioGender}/>
                          <label>Male</label>
                          <input type="radio" name="Gender" value={"Female"} checked={Genderstatus == "Female"} onChange={onChangeRadioGender}/>
                          <label>Female</label>
                        </div>

                        <div className="flex gap-2">
                          <label className="block text-sm font-medium">
                            Marital Status
                          </label>
                          <input type="radio" name="Maritalstatus" value={"Married"} checked={statusMarital == "Married"} onChange={onChangeRadioMarital}/>
                          <label className="">Married</label>
                          <input type="radio" name="Maritalstatus" value={"Unmarried"} checked={statusMarital == "Unmarried"} onChange={onChangeRadioMarital}/>
                          <label>Unmarried</label>
                        </div>
                        <div>
                          <div className="form-group">
                            <label htmlFor="email" className="block text-sm font-medium">
                              Date of Birth
                            </label>
                            <DatePicker id="DOB" name="DOB" className="mt-1 form-control col-12" dateFormat="MM/dd/yyyy" onChange={(date) => {
                setDOB(date);
                setvalue({
                    ...value,
                    ["DOB"]: date
                        ? getShowingMonthDateYear(date)
                        : null,
                });
            }} selected={DOB} timeInputLabel maxDate={new Date()} isClearable={value?.DOB ? true : false} placeholderText={value?.DOB ? value?.DOB : "Select..."}/>
                            {errors?.DOB && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                                {errors?.DOB}
                              </p>)}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="email" className="block text-sm font-medium">
                            Time of Birth*
                          </label>
                          <input type="time" name="TOB" placeholder="TOB" className="mt-1 block w-full border rounded-md p-2" id="TOB" onChange={handleChange} value={value?.TOB || ""}/>
                          {errors?.TOB && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.TOB}
                            </p>)}
                        </div>
                        <div>
                          <label htmlFor="POB" className="block text-sm font-medium">
                            Place of Birth*
                          </label>
                          <input type="text" name="POB" placeholder="POB" className="mt-1 block w-full border rounded-md p-2" id="POB" onChange={handleChange} value={value?.POB || ""}/>
                          {errors?.POB && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.POB}
                            </p>)}
                        </div>

                        <div>
                          <label htmlFor="Faith" className="block text-sm font-medium">
                            Faith*
                          </label>
                          <input type="text" name="Faith" placeholder="Faith" className="mt-1 block w-full border rounded-md p-2" id="Faith" onChange={handleChange} value={value?.Faith || ""}/>
                          {errors?.Faith && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.Faith}
                            </p>)}
                        </div>

                        <div>
                          <label htmlFor="CurrentAddress" className="block text-sm font-medium">
                            Address*
                          </label>
                          <input type="text" name="CurrentAddress" placeholder="CurrentAddress" className="mt-1 block w-full border rounded-md p-2" id="CurrentAddress" onChange={handleChange} value={value?.CurrentAddress || ""}/>
                          {errors?.CurrentAddress && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.CurrentAddress}
                            </p>)}
                        </div>

                        <div>
                          <label htmlFor="City" className="block text-sm font-medium">
                            City*
                          </label>
                          <input type="text" name="City" placeholder="City" className="mt-1 block w-full border rounded-md p-2" id="City" onChange={handleChange} value={value?.City || ""}/>
                          {errors?.City && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.City}
                            </p>)}
                        </div>

                        <div>
                          <label htmlFor="PINCode" className="block text-sm font-medium">
                            PIN Code*
                          </label>
                          <input type="text" name="PINCode" placeholder="Enter PINCode Number" className="mt-1 block w-full border rounded-md p-2" id="PINCode" onChange={HandleChangeInput} maxLength={6} value={value?.PINCode || ""}/>
                          {errors?.PINCode && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.PINCode}
                            </p>)}
                        </div>

                        <div>
                          <label htmlFor="PANCardNo" className="block text-sm font-medium">
                            PAN Number*
                          </label>
                          <input type="text" name="PANCardNo" placeholder="Enter PAN Number" className="mt-1 block w-full border rounded-md p-2" id="PANCardNo" onChange={HandleChangeInput} maxLength={10} value={value?.PANCardNo || ""}/>
                          {errors?.PANCardNo && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.PANCardNo}
                            </p>)}
                        </div>

                        <div>
                          <label htmlFor="AadharNo" className="block text-sm font-medium">
                            Aadhar Number*
                          </label>
                          <input type="text" name="AadharNo" placeholder="Enter Aadhar Number" maxLength={12} className="mt-1 block w-full border rounded-md p-2" id="AadharNo" onChange={HandleChangeInput} value={value?.AadharNo || ""}/>
                          {errors?.AadharNo && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                              {errors?.AadharNo}
                            </p>)}
                        </div>
                      </div>
                      <div className="py-8">
                        <button type="submit" className="bg-primaryColor p-3 block w-[150px] shadow-md rounded-xl hover:scale-105 duration-300 hover:bg-primaryColor text-white mt-4" onClick={BasicDetails_CheckValidationErrors}>
                          Update
                        </button>
                      </div>
                    </>)}

                  {activeTab === "About Me" && (<div className="gap-10">
                      <div className="mb-4 col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium">
                          About Me*
                        </label>
                        <textarea name="Aboutme" placeholder="Enter message..." rows={3} className="mt-1 block w-full border rounded-md p-2" onChange={handleChange} value={value?.Aboutme || ""} id="Aboutme" required></textarea>
                        {errors?.Aboutme && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.Aboutme}
                          </p>)}
                      </div>

                      <div className="col-">
                        <label htmlFor="ExperiencedYears" className="block text-sm font-medium">
                          Experience*
                        </label>
                        <input type="text" style={{ width: "30%" }} name="ExperiencedYears" maxLength={2} placeholder="Experience" className="mt-1 block w-full border rounded-md p-2" id="ExperiencedYears" onChange={HandleChangeInput} value={value?.ExperiencedYears || ""}/>
                        {errors?.ExperiencedYears && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.ExperiencedYears}
                          </p>)}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Language*
                        </label>
                        <Select name="Languages" options={mockLanguagesData} isClearable isMulti value={mockLanguagesData?.filter((obj) => value?.Languages?.includes(obj.value))} onChange={(e) => ChangeDropDown(e, 'Languages')} placeholder="Select..."/>

                        {errors?.Languages && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.Languages}
                          </p>)}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Skills*
                        </label>
                        <Select name="skills" options={mockSkillsData} isMulti isClearable value={mockSkillsData?.filter((obj) => value?.skills?.includes(obj.value))} onChange={(e) => ChangeDropDown(e, 'skills')} placeholder="Select..."/>
                        {errors?.skills && (<p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", }} className="error-message"> {errors?.skills} </p>)}
                      </div>
                      <div className="py-8">
                        <button type="submit" className="bg-primaryColor p-3 block w-[150px] shadow-md rounded-xl hover:scale-105 duration-300 hover:bg-primaryColor text-white mt-4" onClick={Aboutme_CheckValidationErrors}>
                          Update
                        </button>
                      </div>
                    </div>)}

                  {activeTab === "Qualification" && (<div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Select your Highest Qualification *
                        </label>

                        <Select name="HighestQualification" options={mockQualificationData} isClearable value={mockQualificationData.find((obj) => obj.value == value?.HighestQualification)} onChange={(e) => ChangeDropDown3(e, 'HighestQualification')} placeholder="Select..."/>
                        {errors?.HighestQualification && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.HighestQualification}
                          </p>)}
                      </div>

                      <div className="mt-3">
                        <label htmlFor="phone" className="block text-sm font-medium">
                          Select your Degree/Diploma *
                        </label>
                        <Select name="DregeeDiploma" options={mockQualificationData} isClearable value={mockQualificationData?.find((obj) => obj.value == value?.DregeeDiploma)} onChange={(e) => ChangeDropDown3(e, 'DregeeDiploma')} placeholder="Select..."/>
                        {errors?.DregeeDiploma && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.DregeeDiploma}
                          </p>)}
                      </div>

                      <div className="mt-3">
                        <label htmlFor="CollegeUniversity" className="block text-sm font-medium">
                          College/School/University
                        </label>
                        <input type="text" name="CollegeUniversity" className="mt-1 block w-full border rounded-md p-2" id="CollegeUniversity" placeholder="Enter College/University" onChange={handleChange} value={value?.CollegeUniversity || ""}/>
                        {errors?.CollegeUniversity && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.CollegeUniversity}
                          </p>)}
                      </div>

                      <div className="mt-3">
                        <label htmlFor="WhereLearnAstrology" className="block text-sm font-medium">
                          From where did you learn Astrology
                        </label>
                        <input type="text" name="WhereLearnAstrology" className="mt-1 block w-full border rounded-md p-2" id="WhereLearnAstrology" onChange={handleChange} value={value?.WhereLearnAstrology || ""}/>
                        {errors?.WhereLearnAstrology && (<p style={{
                    color: "red",
                    fontSize: "13px",
                    margin: "0px",
                    padding: "0px",
                }} className="error-message">
                            {errors?.WhereLearnAstrology}
                          </p>)}
                      </div>

                      <div className="py-8">
                        <button type="submit" className="bg-primaryColor p-3 block w-[150px] shadow-md rounded-xl hover:scale-105 duration-300 hover:bg-primaryColor text-white mt-4" onClick={Qualification_CheckValidationErrors}>
                          Update
                        </button>
                      </div>
                    </div>)}

                  {activeTab === "Bank Details" && (<div>
                      <p className="text-gray-600">Bank Details component would be implemented here</p>
                    </div>)}

                  {activeTab === "Attachment" && (<div className="space-y-6">
                      {/* Aadhar Front */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-bold">
                                ID
                              </span>
                              <FaIdCard className="text-blue-600 text-sm ml-1"/>
                            </div>
                            <div>
                              <div>
                                <h3 className="font-semibold text-gray-800">
                                  Aadhar Card (Front)
                                </h3>
                                <img src={AadharfrontimgPreview
                ? AadharfrontimgPreview
                : "https://via.placeholder.com/150"} alt="Aadhar Front" className="w-98 h-40 rounded-md border mb-2"/>

                                {AadharfrontimgPreview && (<a href={AadharfrontimgPreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                                    Open File
                                  </a>)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <input type="file" name="frontImg" id="frontImgInput" onChange={handleChangeAttichement} className="hidden"/>

                          <label htmlFor="frontImgInput" className="cursor-pointer inline-block px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                            Choose File
                          </label>

                          {errors?.frontImg && (<p className="text-red-500 text-xs mt-1">{errors.frontImg}</p>)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-green-700 font-medium">
                              Verified
                            </span>
                            <FaCheck className="text-green-600 text-xs"/>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-gray-600">
                            </button>
                            <button className="text-gray-400 hover:text-gray-600"></button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-bold">
                                ID
                              </span>
                              <FaIdCard className="text-blue-600 text-sm ml-1"/>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                Aadhar Card (Back)
                              </h3>
                              <p className="text-xs text-gray-600"></p>
                              <img src={AadharbackimgPreview
                ? AadharbackimgPreview
                : "https://via.placeholder.com/150"} alt="Aadhar Back" className="w-98 h-40 rounded-md border mt-2"/>
                              {AadharbackimgPreview && (<a href={AadharbackimgPreview} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                                  Open File
                                </a>)}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <input type="file" name="backImg" id="backImgInput" onChange={handleChangeAttichement} className="hidden"/>

                          <label htmlFor="backImgInput" className="cursor-pointer inline-block px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                            Choose File
                          </label>

                          {errors?.backImg && (<p className="text-red-500 text-xs mt-1">{errors.backImg}</p>)}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-green-700 font-medium">
                              Verified
                            </span>
                            <FaCheck className="text-green-600 text-xs"/>
                          </div>
                          <div className="flex gap-2">
                            <button className="text-gray-400 hover:text-gray-600">
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="py-8">
                        <button type="submit" className="bg-primaryColor p-3 block w-[150px] shadow-md rounded-xl hover:scale-105 duration-300 hover:bg-primaryColor text-white mt-4" onClick={updateAttachment}>
                          Update
                        </button>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
          </div>
      </div>
    </MenuProvider>);
};
export default Profile;
