import React from 'react' 
import DocumentIcon from '../icons/DocumentIcon/DocumentIcon'

const DocumentHeader = () => {
    return (
        <div className="fixed inset-x-0 top-0 z-10">
            <div className="z-10 border-b bg-body border-b-line bg-opacity-30 backdrop-blur-md" style={{ marginLeft:"384px", marginRight: "320px"}}>
                <div className="flex items-center justify-between max-w-3xl px-4 py-2 mx-auto">
                    <div className="inline-flex items-center">
                        <DocumentIcon className="w-6 h-6" />
                        <h1 className="ml-2 text-xl font-semibold">PeacockGPT Documents</h1>
                    </div>
                </div>
            </div>
        </div>
    )
} 

export default DocumentHeader
