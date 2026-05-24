import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import axios from 'axios'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setCompanies } from '@/redux/companySlice'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    const deleteCompanyHandler = async (companyId) => {
        try {
            const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                const updatedCompany = companies.filter(
                    (company) => company._id !== companyId
                );
                dispatch(setCompanies(updatedCompany));
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Delete failed");
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-center">No. of Jobs</TableHead>
                        <TableHead className="text-center">Total Applicants</TableHead>
                        <TableHead className="text-center">View Jobs</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <tr>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo} />
                                    </Avatar>
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-center">{company.jobsPosted} </TableCell>
                                <TableCell className="text-center">{company.applicationsCount}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Eye
                                                    onClick={() => navigate(`/admin/jobs?companyId=${company._id}`)}
                                                    className="w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-600"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>View Jobs</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <TooltipProvider>
                                        <div className="flex items-center justify-end gap-4">

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Edit2
                                                        onClick={() => navigate(`/admin/companies/${company._id}`)}
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
                                                        onClick={() => deleteCompanyHandler(company._id)}
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

export default CompaniesTable