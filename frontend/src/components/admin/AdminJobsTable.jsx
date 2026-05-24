import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Edit2, Trash2, Eye } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { useSearchParams } from "react-router-dom";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);

  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let filteredJobs = allAdminJobs;

    if (companyId) {
      filteredJobs = filteredJobs.filter(
        (job) => job?.company?._id === companyId
      );
    }

    if (searchJobByText) {
      filteredJobs = filteredJobs.filter((job) =>
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    }

    setFilterJobs(filteredJobs);

  }, [allAdminJobs, searchJobByText, companyId]);
  const handleDelete = async (jobId) => {
    try {
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        const updatedJobs = allAdminJobs.filter(
          (job) => job._id !== jobId
        );
        dispatch(setAllAdminJobs(updatedJobs));
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent  posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">View Applicants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            filterJobs?.map((job) => (
              <tr key={job._id}>
                <TableCell >{job?.company?.name}</TableCell>
                <TableCell>{job?.title}</TableCell>
                <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                <TableCell className="text-center">
                  <TooltipProvider>
                    <div className="flex  justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye
                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                            className="w-7 h-7 cursor-pointer text-gray-700 hover:bg-gray-100 p-1 rounded"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Applicants</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>

                <TableCell className="text-right">
                  <TooltipProvider>
                    <div className="flex items-center justify-end gap-4">

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Edit2
                            onClick={() => navigate(`/admin/job/${job._id}`)}
                            className="w-7 h-7 cursor-pointer text-blue-600 hover:bg-blue-50 p-1 rounded"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Trash2
                            onClick={() => handleDelete(job._id)}
                            className="w-7 h-7 cursor-pointer text-red-600 hover:bg-red-50 p-1 rounded"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </tr>

            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminJobsTable