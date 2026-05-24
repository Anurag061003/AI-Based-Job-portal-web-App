import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
const SavedJobsTable = () => {

    const { user } = useSelector((store) => store.auth);
    const storageKey = `savedJobs_${user?._id}`;

    const [savedJobs, setSavedJobs] = useState([]);
    const navigate = useNavigate();

   useEffect(() => {
    if (!user?._id) return;

    const jobs = JSON.parse(localStorage.getItem(storageKey)) || [];
    setSavedJobs(jobs);
}, [user?._id]);

   const removeSavedJob = (id) => {
    const updatedJobs = savedJobs.filter((job) => job._id !== id);
    setSavedJobs(updatedJobs);
    localStorage.setItem(storageKey, JSON.stringify(updatedJobs));
};

    return (
        <div>
            <Table>
                <TableCaption>A list of your saved jobs !</TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>

                    {
                        savedJobs.length <= 0 ? 
                        (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center">
                                    No saved jobs yet.
                                </TableCell>
                            </TableRow>
                        )
                        :
                        savedJobs.map((job)=>(
                            <TableRow key={job._id}>

                                <TableCell>
                                    {job?.createdAt?.split("T")[0]}
                                </TableCell>

                                <TableCell>
                                    {job?.title}
                                </TableCell>

                                <TableCell>
                                    {job?.company?.name}
                                </TableCell>

                                <TableCell>
                                    <Badge className="bg-purple-500 text-white">
                                        {job?.salary} LPA
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right flex gap-2 justify-end">

                                    <Badge
                                        onClick={()=>navigate(`/description/${job._id}`)}
                                        className="bg-green-500 hover:bg-green-600 cursor-pointer text-white"
                                    >
                                        View
                                    </Badge>

                                    <Badge
                                        onClick={()=>removeSavedJob(job._id)}
                                        className="bg-red-500 hover:bg-red-600 cursor-pointer text-white"
                                    >
                                        Delete
                                    </Badge>

                                </TableCell>

                            </TableRow>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default SavedJobsTable