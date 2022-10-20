import React, { useState, useEffect, useRef } from "react";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
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
  const [folderOption, setFolderOption] = useState("");
  const [fileList, setFileList] = useState([]);
  const { username, email, id } = UseUserReducer();
  const [editState, setEditState] = useState(false);

  const handleClick = async (folder) => {
    setFileList([]);
    // foldersList?.map(async folder => {
    //   console.log(folder)
    //   const colRef = collection(db, `users/${id}/${folder}`)
    //   const fileRef = query(colRef, where('author', '==', `${email}`))
    //   await getDocs(fileRef).then(data => {
    //     setFileList(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    //   })
    // setFileList(data.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    // fileList?.map(file => console.log(file))
    // })
    const colRef = collection(db, `users/${id}/${folder}`);
    const authorRef = query(colRef, where("author", "==", `${email}`));
    const shareRef = query(colRef, where("shareable", "==", true));
    const authorDocs = await getDocs(authorRef);
    const shareDocs = await getDocs(shareRef);
    const data1 = authorDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const data2 = shareDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setFileList([data1, data2]);
    // setFileList(authorDocs.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    // setFileList({...authorDocs,})
    // console.log(fileList)
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

  const uploadFile = () => {
    setLoading(true);
    if (fileUpload === null || folderOption === "") return;
    const extension = fileUpload.name.split(".").pop();
    const fileUrl = `caseFiles/${username}/${folderOption}/file-${fileNameRef.current.value}.${extension}`;
    const fileRef = ref(storage, fileUrl);
    uploadBytes(fileRef, fileUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (url) => {
        const data = {
          filename: snapshot.ref.name,
          author: email,
          folder: folderOption,
          shareable: false,
          url: url,
        };
        const colRef = collection(db, `users/${id}/${folderOption}`);
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
    setLoading(false);
  };

  useEffect(() => {
    const docRef = doc(db, `users/${id}`);
    const getFolders = async () => {
      const snap = await getDoc(docRef);
      const data = snap.data();
      setFoldersList(data.folders);
    };

    getFolders();
  }, [id]);

  // useEffect(() => {
  //   const getPrefixes = () => {
  //     listAll(fileListRef).then(res => {
  //       res.prefixes.forEach(prefix => {
  //         setPrefixList(prefixList => [...prefixList, prefix.name])
  //         listAll(prefix).then(res => {
  //           res.items.forEach(item => {
  //             getDownloadURL(item).then(url => {
  //               const data = {
  //                 prefix: prefix.name,
  //                 name: item.name,
  //                 url: url,
  //               }
  //               setFileList([...fileList, data])
  //             })
  //           })
  //         })
  //       })
  //     })
  //   }
  //   getPrefixes()
  // }, [])

  // const getFiles = prefix => {
  //   const listRef = ref(storage, `caseFiles/${username}/${prefix}`)
  //   listAll(listRef).then(res => {
  //     res.items.forEach(item => {
  //       getDownloadURL(item).then(url => {
  //         setFileList(fileList => [...fileList, url])
  //       })
  //     })
  //   })
  // }

  // const getFiles = () => {
  //   listAll(fileListRef).then(res => {
  //     res.prefixes.forEach(prefix => {
  //       listAll(prefix).then(res => {
  //         res.items.forEach(item => {
  //           getDownloadURL(item).then(url => {
  //             setFileList(fileList => [...fileList, url])
  //           })
  //         })
  //       })
  //     })
  //   })
  // }

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
                  type="file"
                  onChange={(e) => setFileUpload(e.target.files[0])}
                />
                <button disabled={loading} onClick={uploadFile}>
                  Upload
                </button>
                {/* <button onClick={getFiles}>Get Files</button> */}
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
                  <details className="mt-5">
                    <summary
                      className="cursor-pointer"
                      onClick={() => handleClick(folder)}
                    >
                      {folder}
                    </summary>
                    {fileList?.map(
                      (file) =>
                        // console.log('file: ', file)
                        file?.map((data) =>
                          data.folder === folder ? (
                            <a href={data.url}>{data.filename}</a>
                          ) : (
                            ""
                          )
                        )
                      // return file.folder === folder ? <a href={file.url}>{file.filename}</a> : ''
                    )}
                  </details>
                ))}
                {/* <details className='mt-5'>
                  <summary className='cursor-pointer'>288-2-01 (NGCP vs. Perez)</summary>

                  {fileList.map(file => {
                    return <a href={file}>Download now</a>
                  })}
                </details>
                <details>
                  <summary className='cursor-pointer'>288-1-02 (NGCP vs. Tominez)</summary>
                  <p></p>
                </details>
                <details>
                  <summary className='cursor-pointer'>288-1-03 (NGCP vs. Villanueva)</summary>
                  <p></p>
                </details> */}
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
