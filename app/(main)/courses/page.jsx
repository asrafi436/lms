'use client'
import React, { useEffect, useState } from 'react'
import SearchCourse from "./_components/SearchCourse";
import SortCourse from "./_components/SortCourse";
import FilterCourseMobile from "./_components/FilterCourseMobile";
import ActiveFilters from "./_components/ActiveFilters";
import FilterCourse from "./_components/FilterCourse";
import CourseCard from "../courses/_components/CourseCard";


const CoursesPage = () => {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])

  useEffect(() => {

    const fetchData = async () => {

      try {

        const course_data = await fetch('../api/courses')
        const category_data = await fetch('../api/categories')

        const course_response = await course_data.json()
        const category_response = await category_data.json()

        setCourses(course_response.courses)
        setCategories(category_response.categories)

        console.log('Data fetched', course_data)
        console.log('Data fetched', category_response)

      } catch (error) {
        console.error('Error fetching data', error)
      }

    }
    fetchData()
  }, [])

  return (
    <section id="courses" className="container space-y-6   dark:bg-white py-6 px-5 lg:px-24" >
      {/* <h2 className="text-xl md:text-2xl font-medium">All Courses</h2> */}
      {/* header */}
      <div className="flex items-baseline justify-between  border-gray-200 border-b pb-6 flex-col gap-4 lg:flex-row">
        <SearchCourse />
        <div className="flex items-center justify-end gap-2 max-lg:w-full">
          <SortCourse course={courses} category={categories} />
          {/* Filter Menus For Mobile */}
          <FilterCourseMobile course={courses} category={categories} />
        </div>
      </div>
      {/* header ends */}
      {/* active filters */}

      {/* <ActiveFilters
        filter={{
          categories: ["development"],
          price: ["free"],
          sort: ""
        }}
      /> */}

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          {/* these component can be re use for mobile also */}
          <FilterCourse course={courses} category={categories} />
          {/* Course grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {courses
              .filter(course => Number(course.course_active) === 1) // Ensure filtering is correct
              .map(course => (
                <CourseCard key={course.course_id} course={course} />
              ))}
          </div>
        </div>
      </section>
    </section>
  );
};
export default CoursesPage;