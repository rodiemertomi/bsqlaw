import React, { useState, useEffect, useRef, Fragment } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import UseUserReducer from "../../UserReducer";

export default function CaseFolders() {
  const [loading, setLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [foldersList, setFoldersList] = useState([]);
  const fileNameRef = useRef();
  const folderNameRef = useRef();
  const courtRef = useRef();
  const [folderOption, setFolderOption] = useState("");
  const [fileList, setFileList] = useState([]);
  const { username, id, initials } = UseUserReducer();
  const [readState, setReadState] = useState(true);
  const [share, setShare] = useState();
  const [editShareId, setEditShareId] = useState();
  const [editFormData, setEditFormData] = useState({});

  console.log(fileList);

  const handleGetFiles = async () => {
    setFileList([]);
    const colRef = collection(db, `files`);
    const authorRef = query(colRef, where("author", "==", `${initials}`));
    const shareRef = query(colRef, where("shareable", "==", true));
    const authorDocs = await getDocs(authorRef);
    const shareDocs = await getDocs(shareRef);
    const data1 = authorDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const data2 = shareDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setFileList([data1, data2]);
  };

  const addFolder = () => {
    const docRef = doc(db, `users/${id}`);
    const data = {
      folders: arrayUnion(`${folderNameRef.current.value}`),
    };
    updateDoc(docRef, data, { merge: true }).then(() => {
      console.log(`updated successfully`);
    });
    folderNameRef.current.value = "";
  };

  const uploadFile = async () => {
    setLoading(true);
    if (folderOption === "") {
      alert("Please select a folder.");
      setLoading(false);
      return;
    }
    if (fileUpload === null) {
      alert("Please select a file.");
      setLoading(false);
      return;
    }
    const extension = fileUpload.name.split(".").pop();
    const fileUrl = `caseFiles/${username}/${folderOption}/${fileNameRef.current.value}.${extension}`;
    const fileRef = ref(storage, fileUrl);
    await uploadBytes(fileRef, fileUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        const data = {
          active: true,
          filename: snapshot.ref.name,
          date_created: new Date().toString(),
          author: initials,
          folder: folderOption,
          shareable: false,
          url: url,
          court: courtRef.current.value,
        };
        const colRef = collection(db, `files`);
        const docRef = doc(colRef);
        await setDoc(docRef, data).then(() => {
          console.log("successfully added file in firestore");
        });

        console.log("snapshot: ", snapshot.ref.name);
        console.log("url: ", url);
      });
    });
    setFileUpload(null);
    setFolderOption("");
    fileNameRef.current.value = "";
    courtRef.current.value = "";
    setLoading(false);
  };

  const handleEditClick = (e, data) => {
    e.preventDefault();
    setEditShareId(data.id);

    const formValues = {
      shareable: data.shareable,
    };
    setEditFormData(formValues);
    setReadState(false);
  };

  const handleEdit = (e) => {
    const selectedOption = e.target.value;
    setShare(selectedOption);
  };

  const handleCancel = () => {
    setEditShareId(null);
    setReadState(true);
  };

  const checkFolder = (folder1, folder2) => {
    if (folder1 !== folder2) return;
  };

  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    const docRef = doc(db, `files`, editShareId);

    const editedFile = {
      shareable: share,
    };

    setDoc(docRef, editedFile, { merge: true }).then(() => {
      alert("Document updated Successfully");
    });
    setReadState(true);
    setEditShareId(null);
  };

  useEffect(() => {
    const docRef = doc(db, `users/${id}`);
    const getFolders = async () => {
      const snap = await getDoc(docRef);
      const data = snap.data();
      setFoldersList(data.folders);
    };

    getFolders();
    handleGetFiles();
  }, []);

  return (
    <div className="h-screen w-screen overflow-auto lg:overflow-hidden scrollbar-hide md:w-screen md:h-screen lg:w-screen lg:ml-48">
      <h1 className="self-start text-[30px] mt-3 ml-5 font-bold">Case Files</h1>
      <div className="h-full flex flex-col gap-5 items-center  md:w-full md:h-full lg:w-full lg:h-full lg:flex lg:flex-row">
        {/* First Div */}
        <div className="w-[95%] gap-5 mt-6 lg:w-[95%] lg:h-[100%] lg:ml-2">
          {/* Welcome Text */}
          <div className=" rounded-md  flex flex-col  bg-[#D9D9D9] lg:h-[87%] overflow-auto scrollbar-hide">
            <div className="m-5 lg:m-5 text-justify">
              <h1 className="self-start text-[30px] font-bold">
                {username}'s Case Folders
              </h1>
              <div className="flex items-center justify-evenly">
                <input
                  type="text"
                  ref={fileNameRef}
                  placeholder="Enter filename..."
                />
                <select
                  name="folders"
                  id="folders"
                  value={folderOption}
                  onChange={(e) => {
                    setFolderOption(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option default value="">
                    -Select Folder-
                  </option>
                  {foldersList?.map((folder) => (
                    <option value={`${folder}`}>{folder}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Enter Court..."
                  ref={courtRef}
                />
                <input
                  type="file"
                  onChange={(e) => setFileUpload(e.target.files[0])}
                />
                <button disabled={loading} onClick={uploadFile}>
                  Upload
                </button>
              </div>
              <div className="flex items-center justify-evenly">
                <input
                  type="text"
                  ref={folderNameRef}
                  placeholder="Enter folder to add..."
                />
                <button onClick={addFolder}>Add Folder</button>
              </div>
              <div className="flex flex-col gap-10 lg:ml-10">
                {foldersList.map((folder) => (
                  <form onSubmit={handleEditFormSubmit}>
                    <details className="mt-5">
                      <summary
                        className="cursor-pointer"
                        onClick={() => handleGetFiles(folder)}
                      >
                        {folder}
                      </summary>
                      {fileList?.map((file) =>
                        file?.map((data) => (
                          <Fragment key={data.id}>
                            {() => checkFolder(folder, data.folder)}
                            {data.folder === folder ? (
                              readState ? (
                                <ReadOnlyRow
                                  filename={data.filename}
                                  shareable={data.shareable}
                                  url={data.url}
                                  date_created={data.date_created}
                                  court={data.court}
                                  initials={initials}
                                  data={data}
                                  handleEditClick={handleEditClick}
                                  folder={data.folder}
                                />
                              ) : (
                                <EditRow
                                  editFormData={editFormData}
                                  filename={data.filename}
                                  shareable={data.shareable}
                                  url={data.url}
                                  date_created={data.date_created}
                                  court={data.court}
                                  initials={initials}
                                  data={data}
                                  handleCancel={handleCancel}
                                  handleEdit={handleEdit}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </Fragment>
                        ))
                      )}
                    </details>
                  </form>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Second Div */}
        <div className="w-[95%] h-[100%] lg:h-[100%] lg:w-[30%] lg:mt-5 lg:mr-24">
          <div className="flex flex-col gap-5 mb-5 lg:w-[95%] lg:h-[88.4%]">
            <div className=" flex flex-col items-start text-white bg-maroon rounded-md lg:h-[50%] ">
              {/* Todo */}
              <div className="flex flex-col m-5 text-justify ">
                <div className="flex">
                  <h1 className="font-bold">To-Do</h1>
                  <h1 className="font-bold">+</h1>
                </div>
              </div>
            </div>
            {/* Calendar */}
            <div className="flex flex-col items-start text-white  bg-maroon rounded-md lg:h-[45%]">
              <div className="flex flex-col ml-5 mt-5">
                <h1 className="font-bold">Calendar</h1>
                <h1 className="mt-[175px] mb-5 lg:cursor-pointer">
                  Full Calendar
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyRow({
  filename,
  url,
  shareable,
  date_created,
  initials,
  court,
  handleEditClick,
  data,
  folder,
}) {
  return (
    <>
      <table className="w-full ">
        <thead>
          <tr className="flex justify-around ">
            <th className={`text-left w-1/5`}>Case No.</th>
            <th className={`text-left w-1/5`}>Handling Associate</th>
            <th className={`text-left w-1/5`}>Court</th>
            <th className={`text-left w-1/5`}>Date Created</th>
            <th className={`text-left w-1/5`}>Shareable</th>
            <th className={`text-left w-1/5`}>Folder</th>
          </tr>
        </thead>
        <tbody>
          <tr className="flex justify-around">
            <td className={`text-left w-1/5`}>
              <a href={url}>{filename}</a>
            </td>
            <td className={`text-left w-1/5`}>{initials}</td>
            <td className={`text-left w-1/5`}>{court}</td>
            <td className={`text-left w-1/5`}>{date_created}</td>
            <td className={`text-left w-1/5`}>
              {shareable ? "Shared" : "Unshared"}
            </td>
            <td>{folder}</td>
<<<<<<< HEAD
            <button
              onClick={(e) => handleEditClick(e, data)}
              className="w-14 h-8 rounded-md border-0 bg-maroon text-white"
            >
              Edit
            </button>
=======
            <td>
              <button
                onClick={e => handleEditClick(e, data)}
                className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
              >
                Edit
              </button>
            </td>
>>>>>>> fad5c9029dcc547a8f6ef2add1635cada0195ae9
          </tr>
        </tbody>
      </table>
    </>
  );
}

function EditRow({
  filename,
  url,
  shareable,
  date_created,
  initials,
  court,
  handleCancel,
  handleEdit,
}) {
  return (
    <>
      <table className="w-full ">
        <thead>
          <tr className="flex justify-around ">
            <th className={`text-left w-1/5`}>Case No.</th>
            <th className={`text-left w-1/5`}>Handling Associate</th>
            <th className={`text-left w-1/5`}>Court</th>
            <th className={`text-left w-1/5`}>Date Created</th>
            <th className={`text-left w-1/5`}>Shareable</th>
          </tr>
        </thead>
        <tbody>
          <tr className="flex justify-around">
            <td className={`text-left w-1/5`}>
              <a href={url}>{filename}</a>
            </td>
            <td className={`text-left w-1/5`}>{initials}</td>
            <td className={`text-left w-1/5`}>{court}</td>
            <td className={`text-left w-1/5`}>{date_created}</td>
            <td>
              <select onChange={handleEdit}>
                {shareable ? (
                  <>
                    <option value={true}>Shared</option>
                    <option value={false}>Unshared</option>
                  </>
                ) : (
                  <>
                    <option value={false}>Unshared</option>
                    <option value={true}>Shared</option>
                  </>
                )}
              </select>
            </td>
            <td>
              <button className='w-14 h-8 rounded-md border-0 bg-maroon text-white' type='submit'>
                Save
              </button>
              <button
                onClick={handleCancel}
                className='w-14 h-8 rounded-md border-0 bg-maroon text-white'
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
