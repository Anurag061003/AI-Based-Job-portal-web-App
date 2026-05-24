import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch ,useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const CategoryCarousel = () => {
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = [...new Set([...allJobs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // old → new
            .map(job => job.title))].slice(0, 10);
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div>
            <Carousel className="w-full max-w-xl mx-auto my-20">
                <CarouselContent>
                    {
                        categories.map((cat, index) => (
                            <CarouselItem  key={index} className="md:basis-1/2 lg:basis-1/3">
                                <Button onClick={()=>searchJobHandler(cat)} variant="outline" className="rounded-full">{cat}</Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel