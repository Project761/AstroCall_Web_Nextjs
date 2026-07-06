"use client";
import React, { useContext, useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getShowingDateText, getShowingMonthDateYear, toastifySuccess } from "@/app/utils/utility";
import { LiaEditSolid } from "react-icons/lia";
import { BsShieldCheck } from "react-icons/bs";
import { GiIndiaGate, GiPalm, GiCardRandom } from "react-icons/gi";
import { FaCheck, FaIdCard } from "react-icons/fa";
import { useMenuContext } from "@/app/hooks/useMenuContext";
import { TokenWithDeleteUpadateAdd, TokenImageUpload, Comman_changeArrayFormat } from "@/app/utils/api";
import Image from "next/image";
import profilepic from "../../../public/images/profile pic.webp";
import BankDetails from "../bank-details/BankDetailsClient";
import { PanelPageHeader, PanelCard } from "@/app/components/AstrologerPanelUi";
import { AP_BTN_PRIMARY, AP_INPUT } from "@/app/lib/astrologerPanelTheme";
const Profile = () => {
  const router = useRouter();
  const { Get_SingleData_Astrologer, loginAstrologerData, setLoginAstrologerData, LanguagesData, setLanguagesData, SkillsData, setSkillsData, GetDropDownData_lstLanguages: getLanguages, GetDropDownData_Skills: getSkills } = useMenuContext();
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

  const GetDropDownData_DregeeDiploma = useCallback(async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("LoginTokenData"));
      const visitor_Id = localStorage.getItem("visitor_Id");
      const token = auth?.access_token;

      const apiUrl = window.location.origin === "https://astrocall.live"
        ? "https://api.astrocall.live/api/Astrologer/GetDropDownData_DregeeDiploma"
        : "https://liveapi.astrocall.live/api/Astrologer/GetDropDownData_DregeeDiploma";

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "FingerPrintJsKey": visitor_Id,
        },
      });

      const responseData = await response.json();
      const parseData = JSON.parse(responseData?.data);
      const Resdata = parseData?.Table;

      setDregeeDiplomaData(
        Comman_changeArrayFormat(Resdata, "DregeeID", "Description")
      );
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  }, []);

  const GetDropDownData_Qualification = useCallback(async () => {
    try {
      const auth = JSON.parse(localStorage.getItem("LoginTokenData"));
      const visitor_Id = localStorage.getItem("visitor_Id");
      const token = auth?.access_token;

      const apiUrl = window.location.origin === "https://astrocall.live"
        ? "https://api.astrocall.live/api/Astrologer/GetDropDownData_Qualification"
        : "https://liveapi.astrocall.live/api/Astrologer/GetDropDownData_Qualification";

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "FingerPrintJsKey": visitor_Id,
        },
      });

      const responseData = await response.json();
      const parseData = JSON.parse(responseData?.data);
      const Resdata = parseData?.Table;

      setQualificationData(Comman_changeArrayFormat(Resdata, "QualificationID", "Description"));
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      getLanguages();
      getSkills();
      GetDropDownData_DregeeDiploma();
      GetDropDownData_Qualification();
    }, 0);
    return () => clearTimeout(timer);
  }, [getLanguages, getSkills, GetDropDownData_DregeeDiploma, GetDropDownData_Qualification]);

  useEffect(() => {
    if (loginAstrologerData) {
      const timer = setTimeout(() => {
        setvalue({
          ...value,
          FirstName: loginAstrologerData?.FirstName,
          LastName: loginAstrologerData?.LastName,
          EmailID: loginAstrologerData?.EmailID,
          Gender: loginAstrologerData?.Gender,
          Maritalstatus: loginAstrologerData?.Maritalstatus,
          State: loginAstrologerData?.State,
          POB: loginAstrologerData?.POB,
          TOB: loginAstrologerData?.TOB,
          CurrentAddress: loginAstrologerData?.CurrentAddress,
          RegMobileNo: loginAstrologerData?.RegMobileNo,
          PrimaryMobileNo: loginAstrologerData?.PrimaryMobileNo,
          SecondaryMobileNo: loginAstrologerData?.SecondaryMobileNo,
          Faith: loginAstrologerData?.Faith,
          Languages: loginAstrologerData?.Languages,
          PINCode: loginAstrologerData?.PINCode,
          skills: loginAstrologerData?.skills,
          ExperiencedYears: loginAstrologerData?.ExperiencedYears,
          AadharNo: loginAstrologerData?.AadharNo,
          PANCardNo: loginAstrologerData?.PANCardNo,
          City: loginAstrologerData?.City,
          OtherPlatform: loginAstrologerData?.OtherPlatform,
          HighestQualification: loginAstrologerData?.HighestQualification,
          ContributeHoursDay: loginAstrologerData?.ContributeHoursDay,
          SourceBussiness: loginAstrologerData?.SourceBussiness,
          Aboutme: loginAstrologerData?.Aboutme,
          DregeeDiploma: loginAstrologerData?.DregeeDiploma,
          WhereLearnAstrology: loginAstrologerData?.WhereLearnAstrology,
          CollegeUniversity: loginAstrologerData?.CollegeUniversity,
          DOB: loginAstrologerData.DOB ? getShowingDateText(loginAstrologerData.DOB) : "",
        });
        if (loginAstrologerData?.Gender) {
          setGenderstatus(loginAstrologerData.Gender);
        }
        if (loginAstrologerData?.Maritalstatus) {
          setstatusMarital(loginAstrologerData.Maritalstatus);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [loginAstrologerData]);

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
    TokenWithDeleteUpadateAdd("Astrologer/Update_Astrologer", val).then((res) => {
      if (res.success) {
        toastifySuccess("Successfully Update");
        Get_SingleData_Astrologer(GetAstroLoginId);
      } else {
        console.log(res, "error");
      }
    });
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
      TokenWithDeleteUpadateAdd("Astrologer/UpdateAstrologerAboutMe", val).then(
        (res) => {
          if (res) {
            toastifySuccess("Successfully Updated");
            Get_SingleData_Astrologer(GetAstroLoginId);
          }
        }
      );
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
    TokenWithDeleteUpadateAdd("Astrologer/UpdateAstrologerQualification", val).then(
      (res) => {
        if (res.success) {
          toastifySuccess("Successfully Updated");
          Get_SingleData_Astrologer(GetAstroLoginId);
        } else {
          console.error("❌ Update error", res);
        }
      }
    );
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
    const formData = new FormData();
    const { files, AstrologerID } = formDataAt;
    const dataObject = {
      AstrologerID,
    };
    formData.append("Data", JSON.stringify(dataObject));
    if (files.frontImg) {
      formData.append("File", files.frontImg);
    }
    if (files.backImg) {
      formData.append("File1", files.backImg);
    }
    const res = await TokenImageUpload(
      "Astrologer/UpdateAstrologerAadhar",
      formData
    );
    if (res) {
      toastifySuccess("Successfully Update");
      setFormDataAt({
        AstrologerID: GetAstroLoginId,
        ModifiedByUser: "1",
        files: { frontImg: null, backImg: null },
      });
      Get_SingleData_Astrologer(GetAstroLoginId);
    }
  };
  const handleUpdatePhoto = async () => {
    try {
      const formData = new FormData();
      const dataObject = {
        AstrologerID: GetAstroLoginId,
        ModifiedByUser: "1",
      };
      formData.append("Data", JSON.stringify(dataObject));
      formData.append("File", file);
      const res = await TokenImageUpload(
        "Astrologer/UpdateAstrologerPhoto",
        formData
      );
      if (res) {
        toastifySuccess("Successfully Upload");
        Get_SingleData_Astrologer(GetAstroLoginId);
      }
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
  return (
    <div className="mx-auto max-w-[1400px]">
      <PanelPageHeader
        title="My Profile"
        breadcrumbs={["Dashboard", "Profile"]}
        description="Manage your astrology profile — keep your details updated so users can trust your profile."
        action={<span className="text-xs text-gray-400">Last updated: {loginAstrologerData?.ModifiedDate || "—"}</span>}
      />

      {(loginAstrologerData?.IsVerified === "false" || loginAstrologerData?.IsVerified === false) && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Your Approval Request Is Pending.</p>
          <p className="text-sm">Please wait until the admin accepts your request.</p>
        </div>
      )}

      <PanelCard className="mb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100 ring-4 ring-orange-50">
                <img
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : loginAstrologerData?.AvatarUrl
                        ? `https://${loginAstrologerData.AvatarUrl.replace(/\\/g, "/")}`
                        : profilepic.src
                  }
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <label htmlFor="fileInput" className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-white p-1 shadow">
                <LiaEditSolid size={18} className="text-[#FF5C00]" />
              </label>
              <input type="file" id="fileInput" accept="image/*" onChange={fileHandler} className="hidden" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A]">{loginAstrologerData?.FirstName}</h2>
              <p className="text-sm text-gray-500">{loginAstrologerData?.skillsValue}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(loginAstrologerData?.IsVerified === "true" || loginAstrologerData?.IsVerified === true) && (
              <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                <BsShieldCheck className="text-green-600" />
                Verified Expert
              </span>
            )}
            <button type="button" className={`${AP_BTN_PRIMARY} rounded-full px-4 py-2 text-sm`} onClick={handleUpdatePhoto}>
              Upload Photo
            </button>
          </div>
        </div>
      </PanelCard>

      <PanelCard>
        <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-4">
          {["Basic Details", "About Me", "Qualification", "Bank Details", "Attachment"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-[#FF5C00] text-white shadow-sm"
                  : "bg-[#FFF9F1] text-gray-600 hover:bg-orange-50 hover:text-[#FF5C00]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="py-2">
                {activeTab === "Basic Details" && (<>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">First Name*</label>
                        <input type="text" name="FirstName" placeholder="First Name" className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-orange-100 focus:border-[#FF5C00]" onChange={handleChange} value={value?.FirstName || ""} />
                      {errors?.FirstName && (<p className="text-red-500 text-xs">
                        {errors?.FirstName}
                      </p>)}
                    </div>
                    <div>
                      <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">Last Name*</label>
                      <input type="text" name="LastName" placeholder="Last Name" className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-orange-100 focus:border-[#FF5C00]" onChange={handleChange} value={value?.LastName || ""} />
                      {errors?.LastName && (<p className="text-red-500 text-xs">
                        {errors?.LastName}
                      </p>)}
                    </div>
                    <div>
                      <label htmlFor="MobileNo" className="block text-sm font-medium text-gray-700">Reg Mobile No*</label>
                      <input type="text" name="RegMobileNo" placeholder="RegMobileNo" className="mt-1 block w-full border border-gray-200 rounded-md p-2 bg-gray-50" maxLength={10} value={value?.RegMobileNo || ""} readOnly />
                      {errors?.RegMobileNo && (<p className="text-red-500 text-xs">
                        {errors?.RegMobileNo}
                      </p>)}
                    </div>
                    <div>
                      <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">Email*</label>
                      <input type="EmailID" name="EmailID" placeholder="Email" className="mt-1 block w-full border border-gray-200 rounded-md p-2 focus:ring-2 focus:ring-orange-100 focus:border-[#FF5C00]" onChange={handleChange} value={value?.EmailID || ""} />
                      {errors.EmailID && (<p className="text-red-500 text-xs">
                        {errors.EmailID}
                      </p>)}
                    </div>
                    <div className="flex gap-2">
                      <label className="block text-sm font-medium">
                        Gender
                      </label>
                      <input type="radio" name="Gender" value={"Male"} checked={Genderstatus == "Male"} onChange={onChangeRadioGender} />
                      <label>Male</label>
                      <input type="radio" name="Gender" value={"Female"} checked={Genderstatus == "Female"} onChange={onChangeRadioGender} />
                      <label>Female</label>
                    </div>

                    <div className="flex gap-2">
                      <label className="block text-sm font-medium">
                        Marital Status
                      </label>
                      <input type="radio" name="Maritalstatus" value={"Married"} checked={statusMarital == "Married"} onChange={onChangeRadioMarital} />
                      <label className="">Married</label>
                      <input type="radio" name="Maritalstatus" value={"Unmarried"} checked={statusMarital == "Unmarried"} onChange={onChangeRadioMarital} />
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
                        }} selected={DOB} timeInputLabel maxDate={new Date()} isClearable={value?.DOB ? true : false} placeholderText={value?.DOB ? value?.DOB : "Select..."} />
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
                      <input type="time" name="TOB" placeholder="TOB" className="mt-1 block w-full border rounded-md p-2" id="TOB" onChange={handleChange} value={value?.TOB || ""} />
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
                      <input type="text" name="POB" placeholder="POB" className="mt-1 block w-full border rounded-md p-2" id="POB" onChange={handleChange} value={value?.POB || ""} />
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
                      <input type="text" name="Faith" placeholder="Faith" className="mt-1 block w-full border rounded-md p-2" id="Faith" onChange={handleChange} value={value?.Faith || ""} />
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
                      <input type="text" name="CurrentAddress" placeholder="CurrentAddress" className="mt-1 block w-full border rounded-md p-2" id="CurrentAddress" onChange={handleChange} value={value?.CurrentAddress || ""} />
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
                      <input type="text" name="City" placeholder="City" className="mt-1 block w-full border rounded-md p-2" id="City" onChange={handleChange} value={value?.City || ""} />
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
                      <input type="text" name="PINCode" placeholder="Enter PINCode Number" className="mt-1 block w-full border rounded-md p-2" id="PINCode" onChange={HandleChangeInput} maxLength={6} value={value?.PINCode || ""} />
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
                      <input type="text" name="PANCardNo" placeholder="Enter PAN Number" className="mt-1 block w-full border rounded-md p-2" id="PANCardNo" onChange={HandleChangeInput} maxLength={10} value={value?.PANCardNo || ""} />
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
                      <input type="text" name="AadharNo" placeholder="Enter Aadhar Number" maxLength={12} className="mt-1 block w-full border rounded-md p-2" id="AadharNo" onChange={HandleChangeInput} value={value?.AadharNo || ""} />
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
                    <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E85500] mt-4" onClick={BasicDetails_CheckValidationErrors}>
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
                    <input type="text" style={{ width: "30%" }} name="ExperiencedYears" maxLength={2} placeholder="Experience" className="mt-1 block w-full border rounded-md p-2" id="ExperiencedYears" onChange={HandleChangeInput} value={value?.ExperiencedYears || ""} />
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
                    <Select name="Languages" options={LanguagesData} isClearable isMulti value={LanguagesData?.filter((obj) => value?.Languages?.includes(obj.value))} onChange={(e) => ChangeDropDown(e, 'Languages')} placeholder="Select..." />

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
                    <Select name="skills" options={SkillsData} isMulti isClearable value={SkillsData?.filter((obj) => value?.skills?.includes(obj.value))} onChange={(e) => ChangeDropDown(e, 'skills')} placeholder="Select..." />
                    {errors?.skills && (<p style={{ color: "red", fontSize: "13px", margin: "0px", padding: "0px", }} className="error-message"> {errors?.skills} </p>)}
                  </div>
                  <div className="py-8">
                    <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E85500] mt-4" onClick={Aboutme_CheckValidationErrors}>
                      Update
                    </button>
                  </div>
                </div>)}

                {activeTab === "Qualification" && (<div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Select your Highest Qualification *
                    </label>

                    <Select name="HighestQualification" options={QualificationData} isClearable value={QualificationData?.find((obj) => obj?.value == value?.HighestQualification)} onChange={(e) => ChangeDropDown3(e, 'HighestQualification')} placeholder="Select..." />
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
                    <Select name="DregeeDiploma" options={DregeeDiplomaData} isClearable value={DregeeDiplomaData?.find((obj) => obj.value == value?.DregeeDiploma)} onChange={(e) => ChangeDropDown3(e, 'DregeeDiploma')} placeholder="Select..." />
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
                    <input type="text" name="CollegeUniversity" className="mt-1 block w-full border rounded-md p-2" id="CollegeUniversity" placeholder="Enter College/University" onChange={handleChange} value={value?.CollegeUniversity || ""} />
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
                    <input type="text" name="WhereLearnAstrology" className="mt-1 block w-full border rounded-md p-2" id="WhereLearnAstrology" onChange={handleChange} value={value?.WhereLearnAstrology || ""} />
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
                    <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E85500] mt-4" onClick={Qualification_CheckValidationErrors}>
                      Update
                    </button>
                  </div>
                </div>)}

                {activeTab === "Bank Details" && (
                  <BankDetails embedded />
                )}

                {activeTab === "Attachment" && (<div className="space-y-6">
                  {/* Aadhar Front */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                          <span className="text-[#FF5C00] text-sm font-bold">
                            ID
                          </span>
                          <FaIdCard className="text-[#FF5C00] text-sm ml-1" />
                        </div>
                        <div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Aadhar Card (Front)
                            </h3>
                            <img src={AadharfrontimgPreview
                              ? AadharfrontimgPreview
                              : "https://via.placeholder.com/150"} alt="Aadhar Front" className="w-98 h-40 rounded-md border mb-2" />

                            {AadharfrontimgPreview && (<a href={AadharfrontimgPreview} target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] text-sm hover:underline">
                              Open File
                            </a>)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <input type="file" name="frontImg" id="frontImgInput" onChange={handleChangeAttichement} className="hidden" />

                      <label htmlFor="frontImgInput" className="cursor-pointer inline-block rounded-md bg-[#FF5C00] px-4 py-1 text-sm text-white transition hover:bg-[#E85500]">
                        Choose File
                      </label>

                      {errors?.frontImg && (<p className="text-red-500 text-xs mt-1">{errors.frontImg}</p>)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-700 font-medium">
                          Verified
                        </span>
                        <FaCheck className="text-green-600 text-xs" />
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                        </button>
                        <button className="text-gray-400 hover:text-gray-600"></button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                          <span className="text-[#FF5C00] text-sm font-bold">
                            ID
                          </span>
                          <FaIdCard className="text-[#FF5C00] text-sm ml-1" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Aadhar Card (Back)
                          </h3>
                          <p className="text-xs text-gray-600"></p>
                          <img src={AadharbackimgPreview
                            ? AadharbackimgPreview
                            : "https://via.placeholder.com/150"} alt="Aadhar Back" className="w-98 h-40 rounded-md border mt-2" />
                          {AadharbackimgPreview && (<a href={AadharbackimgPreview} target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] text-sm hover:underline">
                            Open File
                          </a>)}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <input type="file" name="backImg" id="backImgInput" onChange={handleChangeAttichement} className="hidden" />

                      <label htmlFor="backImgInput" className="cursor-pointer inline-block rounded-md bg-[#FF5C00] px-4 py-1 text-sm text-white transition hover:bg-[#E85500]">
                        Choose File
                      </label>

                      {errors?.backImg && (<p className="text-red-500 text-xs mt-1">{errors.backImg}</p>)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-green-700 font-medium">
                          Verified
                        </span>
                        <FaCheck className="text-green-600 text-xs" />
                      </div>
                      <div className="flex gap-2">
                        <button className="text-gray-400 hover:text-gray-600">
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="py-8">
                    <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-[#FF5C00] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#E85500] mt-4" onClick={updateAttachment}>
                      Update
                    </button>
                  </div>
                </div>)}
        </div>
      </PanelCard>
    </div>
  );
};
export default Profile;
