"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TokenImageUpload, TokenWithDeleteUpadateAdd, postWithToken } from "@/app/utils/api";
import { MdDelete } from "react-icons/md";
import { PanelPageHeader, PanelCard, PanelEmpty } from "@/app/components/AstrologerPanelUi";
import { AP_INPUT, AP_BTN_PRIMARY, AP_BTN_OUTLINE } from "@/app/lib/astrologerPanelTheme";
import { toastifySuccess } from "@/app/utils/utility";

const BankDetails = ({ embedded = false }) => {
  const router = useRouter();
  const GetAstroLoginId = typeof window !== 'undefined' && localStorage.getItem("AstroLoginId")
    ? localStorage.getItem("AstroLoginId")
    : "";

  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [BankDetailsData, setBankDetailsData] = useState();
  const [BankID, setBankID] = useState();
  const [Editval, setEditval] = useState();
  const [clickedRow, setClickedRow] = useState(null);
  const [BankDetailsID, SetBankDetailsID] = useState();
  const [AttachmentPreview, setAttachmentPreview] = useState(null);
  const [Bankvalue, setBankvalue] = useState({
    AstroID: "",
    AccountName: "",
    AccountNo: "",
    BankName: "",
    IFSCCode: "",
    Status: "",
    Attachmenturl: "",
    CreatedByUser: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setBankvalue((prev) => ({ ...prev, [name]: value }));
  };

  const HandleChangeInput = (e) => {
    if (e.target.name === "AccountNo") {
      let ele = e.target.value.replace(/[^0-9]/g, "");
      setBankvalue({ ...Bankvalue, [e.target.name]: ele });
    }
  };

  const handleChangeFile = (e) => {
    const { name, files } = e.target;

    if (files && files[0]) {
      const file = files[0];

      setAttachmentPreview(URL.createObjectURL(file));

      setBankvalue((prevValue) => ({
        ...prevValue,
        [name]: file, // storing actual file
      }));
    }
  };

  const reset = () => {
    setBankvalue({
      ...Bankvalue,
      AstroID: "",
      AccountName: "",
      AccountNo: "",
      BankName: "",
      IFSCCode: "",
      Status: "",
      Attachmenturl: "",
      CreatedByUser: 1,
    });
  };

  const CheckValidationErrors = () => {
    const newErrors = {};
    if (!Bankvalue?.AccountName) {
      newErrors.AccountName = "required *";
    }
    if (!Bankvalue?.AccountNo) {
      newErrors.AccountNo = "required *";
    }
    if (!Bankvalue?.BankName) {
      newErrors.BankName = "required *";
    }
    if (!Bankvalue?.IFSCCode) {
      newErrors.IFSCCode = "required *";
    }
    setErrors(newErrors);
    if (Object?.keys(newErrors)?.length === 0) {
      if (BankDetailsID) {
        Update_BankDetails();
      } else {
        Insert_BankDetails();
      }
    }
  };

  const ResetBankDetails = () => {
    reset();
    setFile(null);
    setClickedRow("");
    SetBankDetailsID("");
  };

  const Get_Data_BankDetails = useCallback(async () => {
    const val = { IsActive: "1", AstroID: GetAstroLoginId };
    try {
      const res = await postWithToken("BankDetails/GetData_BankDetails", val);
      if (res) {
        setBankDetailsData(res);
      }
    } catch (error) {
      console.log(error);
    }
  }, [GetAstroLoginId]);

  const GetSingleData_BankDetails = async (bankDetailsID) => {
    const val = { BankDetailsID: bankDetailsID };
    try {
      const res = await postWithToken(
        "BankDetails/GetSingleData_BankDetails",
        val
      );
      if (res) {
        setEditval(res);
        setBankvalue({
          ...Bankvalue,
          AccountName: res[0]?.AccountName,
          AccountNo: res[0]?.AccountNo,
          BankName: res[0]?.BankName,
          IFSCCode: res[0]?.IFSCCode,
          Attachmenturl: res[0]?.Attachmenturl,
        });
        Get_Data_BankDetails();
      } else {
        setEditval([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Insert_BankDetails = async (e) => {
    const {
      AstroID,
      AccountName,
      AccountNo,
      BankName,
      IFSCCode,
      Status,
      Attachmenturl,
    } = Bankvalue;
    const val = {
      AccountName,
      AccountNo,
      BankName,
      IFSCCode,
      Status,
      CreatedByUser: "1",
      AstroID: GetAstroLoginId,
    };
    const allowedExtensions =
      /(\.apng|\.png|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp)$/i;
    if (Attachmenturl) {
      if (!allowedExtensions.exec(Attachmenturl.name)) {
        return;
      }
      if (Attachmenturl.size > 2 * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(Attachmenturl);
    }
    const formData = new FormData();
    formData.append("Attachmenturl", Attachmenturl);
    formData.append("Data", JSON.stringify(val));
    try {
      const res = await TokenImageUpload(
        "BankDetails/Insert_BankDetails",
        formData
      );
      if (res?.success) {
        toastifySuccess("Insert successfully");
        Get_Data_BankDetails();
        ResetBankDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Update_BankDetails = async (e) => {
    const {
      AccountName,
      AccountNo,
      BankName,
      IFSCCode,
      Status,
      Attachmenturl,
      ModifiedByUser,
    } = Bankvalue;
    const val = {
      AccountName,
      AccountNo,
      BankName,
      IFSCCode,
      Status,
      ModifiedByUser: "1",
      BankDetailsID: BankDetailsID,
    };
    const allowedExtensions =
      /(\.apng|\.png|\.jpg|\.jpeg|\.jfif|\.pjpeg|\.pjp)$/i;
    if (Attachmenturl) {
      if (!allowedExtensions.exec(Attachmenturl.name)) {
        return;
      }
      if (Attachmenturl.size > 2 * 1024 * 1024) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(Attachmenturl);
    }
    const formData = new FormData();
    formData.append("Attachmenturl", Attachmenturl);
    formData.append("Data", JSON.stringify(val));
    try {
      const res = await TokenImageUpload(
        "BankDetails/Update_BankDetails",
        formData
      );
      if (res) {
        toastifySuccess("Updated successfully");
        Get_Data_BankDetails();
        ResetBankDetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!GetAstroLoginId) return;
    const timer = setTimeout(() => {
      Get_Data_BankDetails();
    }, 0);
    return () => clearTimeout(timer);
  }, [GetAstroLoginId, Get_Data_BankDetails]);

  const Delete_BankDetails = async (bankDetailsID) => {
    const val = {
      IsActive: "0",
      BankDetailsID: bankDetailsID,
      DeleteByUser: "",
    };
    try {
      const res = await TokenWithDeleteUpadateAdd("BankDetails/Delete_BankDetails", val);
      if (res) {
        Get_Data_BankDetails();
        toastifySuccess("Delete successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const set_Edit_Value = (row) => {
    SetBankDetailsID(row.BankDetailsID);
    GetSingleData_BankDetails(row.BankDetailsID);
  };

  const columns = [
    { name: "BankName", selector: (row) => row.BankName, sortable: true },
    { name: "AccountNo", selector: (row) => row.AccountNo, sortable: true },
    { name: "AccountName", selector: (row) => row.AccountName, sortable: true },
    { name: "IFSCCode", selector: (row) => row.IFSCCode, sortable: true },
    {
      name: (
        <p
          className="text-end"
          style={{ position: "absolute", top: "7px", right: 50 }}
        >
          Action
        </p>
      ),
      cell: (row) => (
        <div style={{ position: "absolute", top: 4, right: 50 }}>
          <MdDelete
            onClick={() => {
              Delete_BankDetails(row.BankDetailsID);
            }}
            style={{ height: "22px", width: "22px", color: " #ff1a1a" }}
          />
        </div>
      ),
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row === clickedRow,
      style: {
        backgroundColor: "#001f3fbd",
        color: "white",
        cursor: "pointer",
      },
    },
  ];
  const getImageUrl = (path) => {
    if (!path) return null;

    const cleanedPath = path.replace(/\\/g, "/");

    if (cleanedPath.includes("api.astrocall.live")) {
      return cleanedPath.startsWith("http")
        ? cleanedPath
        : `https://${cleanedPath}`;
    }

    return `https://api.astrocall.live/${cleanedPath}`;
  };

  const customStyles = {
    rows: {
      style: {
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        "&:hover": {
          backgroundColor: "#e6f0ff",
        },
      },
    },
  };

  const content = (
    <>
      {!embedded && (
        <PanelPageHeader
          title="Bank Details"
          breadcrumbs={["Dashboard", "Bank Details"]}
          description="Manage your bank account information for payouts."
        />
      )}

      <PanelCard title={embedded ? "Bank Account" : "Add / Edit Bank Account"} className={embedded ? "border-0 p-0 shadow-none" : "mb-5"}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="AccountName" className="block text-sm font-medium">
                  Account Name*
                </label>
                <input
                  type="text"
                  name="AccountName"
                  placeholder="Bank Account Name"
                  className={AP_INPUT}
                  onChange={handleChange}
                  value={Bankvalue?.AccountName}
                />
                {errors?.AccountName && (
                  <p className="text-red-500 text-xs">{errors?.AccountName}</p>
                )}
              </div>

              <div>
                <label htmlFor="AccountNo" className="block text-sm font-medium">
                  Account No*
                </label>
                <input
                  type="text"
                  name="AccountNo"
                  placeholder="Bank Account Number"
                  className={AP_INPUT}
                  onChange={HandleChangeInput}
                  maxLength={18}
                  minLength={8}
                  value={Bankvalue?.AccountNo}
                />
                {errors?.AccountNo && (
                  <p className="text-red-500 text-xs">{errors?.AccountNo}</p>
                )}
              </div>

              <div>
                <label htmlFor="BankName" className="block text-sm font-medium">
                  Bank Name*
                </label>
                <input
                  type="text"
                  name="BankName"
                  placeholder="Bank Name"
                  className={AP_INPUT}
                  onChange={handleChange}
                  value={Bankvalue?.BankName}
                />
                {errors?.BankName && (
                  <p className="text-red-500 text-xs">{errors?.BankName}</p>
                )}
              </div>

              <div>
                <label htmlFor="IFSCCode" className="block text-sm font-medium">
                  IFSC Code*
                </label>
                <input
                  type="text"
                  name="IFSCCode"
                  placeholder="IFSC Code"
                  className={AP_INPUT}
                  onChange={handleChange}
                  value={Bankvalue?.IFSCCode}
                />
                {errors.IFSCCode && (
                  <p className="text-red-500 text-xs">{errors.IFSCCode}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <h3 className="font-semibold text-gray-800 mb-2">Bank Attachment</h3>

                <div className="flex flex-wrap md:flex-nowrap items-start gap-4">
                  <input
                    type="file"
                    name="Attachmenturl"
                    id="AttachmentInput"
                    className="hidden"
                    onChange={handleChangeFile}
                  />

                  <label
                    htmlFor="AttachmentInput"
                    className="inline-block cursor-pointer rounded-md bg-[#FF5C00] px-4 py-2 text-sm text-white transition hover:bg-[#E85500]"
                  >
                    Choose File
                  </label>

                  {(AttachmentPreview || Bankvalue?.Attachmenturl) && (
                    <div className="flex flex-col items-start">
                      <img
                        src={
                          AttachmentPreview
                            ? AttachmentPreview
                            : getImageUrl(
                                Bankvalue?.Attachmenturl?.name
                                  ? null
                                  : Bankvalue?.Attachmenturl
                              )
                        }
                        alt="Bank Attachment"
                        className="w-80 h-auto rounded-md border"
                      />

                      <a
                        href={
                          AttachmentPreview
                            ? AttachmentPreview
                            : getImageUrl(
                                Bankvalue?.Attachmenturl?.name
                                  ? null
                                  : Bankvalue?.Attachmenturl
                              )
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-sm text-[#FF5C00] hover:underline"
                      >
                        Open Image
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

        <div className="mt-4 flex gap-2">
          {BankDetailsID ? (
            <button type="button" className={AP_BTN_PRIMARY} onClick={() => CheckValidationErrors()}>Update</button>
          ) : (
            <button type="button" className={AP_BTN_PRIMARY} onClick={() => CheckValidationErrors()}>Save</button>
          )}
          <button type="button" className={AP_BTN_OUTLINE} onClick={ResetBankDetails}>New</button>
        </div>
      </PanelCard>

      <PanelCard title="Saved Bank Details" className={embedded ? "mt-4 border-0 p-0 shadow-none" : ""}>
        {BankDetailsData && BankDetailsData.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-[#FFF9F1] text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Bank Name</th>
                  <th className="px-4 py-3">Account No</th>
                  <th className="px-4 py-3">Account Name</th>
                  <th className="px-4 py-3">IFSC Code</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {BankDetailsData.map((row, index) => (
                  <tr
                    key={row.BankDetailsID || index}
                    className={`cursor-pointer transition hover:bg-orange-50/50 ${clickedRow === row ? "bg-orange-50" : ""}`}
                    onClick={() => { setClickedRow(row); set_Edit_Value(row); }}
                  >
                    <td className="px-4 py-3">{row.BankName}</td>
                    <td className="px-4 py-3">{row.AccountNo}</td>
                    <td className="px-4 py-3">{row.AccountName}</td>
                    <td className="px-4 py-3">{row.IFSCCode}</td>
                    <td className="px-4 py-3">
                      <MdDelete
                        onClick={(e) => { e.stopPropagation(); Delete_BankDetails(row.BankDetailsID); }}
                        className="h-5 w-5 cursor-pointer text-red-500 hover:text-red-700"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <PanelEmpty message="No bank accounts saved yet." />
        )}
      </PanelCard>
    </>
  );

  if (embedded) return content;

  return <div className="mx-auto max-w-[1400px]">{content}</div>;
};

export default BankDetails;
