import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { TfiCheck, TfiFile } from "react-icons/tfi";
import axiosWrapper from "@/utils/axiosWrapper";

const ShowFilesList = ({ item, selected, selectHandler }) => {
    return <div className={`flex items-center max-w-max px-5 shadow-xl rounded-xl h-12 bg-blue-400 cursor-pointer m-2 ${selected ? 'border-2 border-blue-800' : ''}`} onClick={() => selectHandler(item)}>
        <div className="flex items-center justify-center rounded-full">
            <TfiFile size="20" className="text-white" />
            <span className="absolute text-2xl text-blue-700" x-text="`${percent}%`"></span>
        </div>
        <p className="ml-3 font-medium text-white sm:text-xl">{item}</p>
        {selected ? <TfiCheck size="20" className="text-white font-bold ml-2" /> : ''}
    </div>
}

export default function Home() {
    const [currentFile, setCurrentFile] = useState(null)
    const [filesList, setFilesList] = useState([])
    const [fileStats, setFileStat] = useState(null)

    useEffect(() => {
        axiosWrapper.getFilesXLSX().then((data) => {
            setFilesList(data.files || [])
        })
    }, [])

    // events
    const evSelectFile = (fileName) => {
        setCurrentFile(fileName)
        axiosWrapper.getFilesStats(fileName).then((data) => {
            console.log(data)
            setFileStat(data)
        })
    }

    return <>
        <Header />
        <section className="text-gray-800 body-font">
            <div className="container px-5 py-10 mx-auto">
                <div className="flex flex-wrap -m-4 justify-center">
                    {filesList.map((row, i) => <ShowFilesList item={row} key={`k-${i}`} selected={currentFile == row} selectHandler={evSelectFile} />)}
                </div>
            </div>
        </section>
        <section className="text-gray-800 body-font">
            <div className="container px-5 py-10 mx-auto">
                {fileStats ? 
                <div className=" w-full lg:max-w-full lg:flex">
                    <div className="border-r border-b border-l border-gray-400 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b lg:rounded-l lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                        <div className="mb-1">
                            <div className="text-gray-900 font-bold text-xl mb-2">{currentFile}</div>
                            <p className="text-gray-700 text-base">Created At: {fileStats.stats.ctime}</p>
                            <p className="text-gray-700 text-base">Modified At: {fileStats.stats.mtime}</p>
                            <div className="text-sm">
                                <p className="text-gray-600">Size: {(fileStats.stats.size/(1024*1024)).toFixed(2)} MB</p>
                            </div>
                        </div>
                    </div>
                </div> : ''}
            </div>
        </section>
    </>
}
