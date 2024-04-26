import Header from "@/components/Header";
import React, { useEffect, useState } from "react";
import { TfiCheck, TfiFile } from "react-icons/tfi";
import axiosWrapper from "@/utils/axiosWrapper";
import { generateRandomChar } from "@/utils/utils";

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
    const [formData, setFormData] = useState({})
    const [formFields, setFormFields] = useState([])
    const [rowData, setRowData] = useState({ after: {}, before: {} })
    const [filesList, setFilesList] = useState([])
    const [fileStats, setFileStat] = useState(null)
    const [apiProcess, setApiProcess] = useState({
        loading: false,
        response: null,
        err: null
    })

    useEffect(() => {
        axiosWrapper.getFilesXLSX().then((data) => {
            let f = data.files || []
            f = f.filter(e => !e.startsWith('~') && e.endsWith('xlsx'))
            setFilesList(f)
        })
    }, [])

    // events
    const evSelectFile = (fileName) => {
        setCurrentFile(fileName)
        axiosWrapper.getFilesStats(fileName).then((data) => {
            setFileStat(data)
        })
    }

    const updateFormValues = (key, e) => {
        setFormData({ ...formData, [key]: e.target.value })
        e.preventDefault()
    }

    const evKeyDownEvent = (e, key) => {
        if (key == 'ID') {
            if (e.key === 'Enter') {
                e.preventDefault()
                setApiProcess({ ...apiProcess, loading: true })
                setRowData({ after: {}, before: {} })
                setFormData({ 'ID': formData['ID'] })
                setFormFields([])
                axiosWrapper.getSearchRow(currentFile, formData['ID']).then(resp => {
                    if (resp.found) {
                        setRowData({ ...rowData, before: resp.found })
                        setFormData({ ...formData, ...resp.found })
                    } else {
                        let emptyForm = {}
                        resp.cols.forEach(element => {
                            emptyForm[element] = ''
                        });
                        setFormData({ ...emptyForm, 'ID': formData['ID'] })
                    }
                    setFormFields(resp.cols)
                }).finally(() => {
                    setApiProcess({ ...apiProcess, loading: false })
                })
            }
        } else {
            if (e.key === 'Enter') {
                setApiProcess({ ...apiProcess, loading: true })
                axiosWrapper.updateSelectedRow(currentFile, formData['ID'], formData).then(resp => {
                    console.log(resp)
                }).catch(err => { console.log(err) }).finally(() => {
                    setApiProcess({ ...apiProcess, loading: false })
                })
            }
        }
    }

    return <>
        <Header />
        {apiProcess.loading ? <div className="absolute bg-white backdrop-blur-sm bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-gray-500">
                <span className="h-6 w-6 block rounded-full border-4 border-t-blue-300 animate-spin"></span>
                <h2 className="text-center text-xl font-semibold">Loading...</h2>
                <p className="w-auto text-center">This may take a few seconds, please don't close this page.</p>
            </div>
        </div> : ''}

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
                                    <p className="text-gray-600">Size: {(fileStats.stats.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            </div>
                        </div>
                    </div> : ''}
            </div>
        </section>
        {fileStats ? <section className="text-gray-800 body-font">
            <div className="container px-5 py-10 mx-auto">
                <form className="w-full">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="search-id">
                                Recipient ID / Search By
                            </label>
                            <input className="appearance-none block w-full bg-gray-50 text-gray-700 border rounded py-3 px-4 mb-3 leading-6 focus:outline-none focus:bg-white" id="search-id" type="text" placeholder="1...9999" autoComplete="new-password" name="search-id" onChange={(e) => updateFormValues('ID', e)} onKeyDown={(e) => evKeyDownEvent(e, 'ID')} disabled={apiProcess.loading} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {rowData.before && Object.keys(rowData.before).length ? Object.keys(rowData.before).map((k, i) => <div className="w-full px-3 mb-6 md:mb-0" key={`f-${i}`}>
                            <label className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2" htmlFor="grid-city">
                                {k}
                            </label>
                            <input className="appearance-none block w-full bg-gray-50 text-gray-900 border rounded py-3 px-4 leading-6 focus:outline-none focus:bg-white" type="text" autoComplete="new-password" onChange={(e) => updateFormValues(k, e)} onKeyDown={(e) => evKeyDownEvent(e, k)} value={formData[k]} />
                        </div>) : formFields.map((k, i) => <div className="w-full px-3 mb-6 md:mb-0" key={`f-${i}`}>
                            <label className="block uppercase tracking-wide text-gray-900 text-xs font-bold mb-2" htmlFor="grid-city">
                                {k}
                            </label>
                            <input className="appearance-none block w-full bg-gray-50 text-gray-900 border rounded py-3 px-4 focus:outline-none focus:bg-white leading-6" type="text" autoComplete="new-password" onChange={(e) => updateFormValues(k, e)} onKeyDown={(e) => evKeyDownEvent(e, k)} value={formData[k] || ''} disabled={apiProcess.loading} />
                        </div>)}
                    </div>
                </form>
            </div>
        </section> : ''}
    </>
}
