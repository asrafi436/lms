import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SectionTitle } from "@/components/section-title";

const Testimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return <p className="text-center text-gray-600">No testimonials available.</p>;
  }

  return (
    <section className="pb-8 md:pb-12 lg:pb-24">
      <div className="container mx-0 lg:mx-auto px-5">
        <SectionTitle className="mb-6">Testimonials</SectionTitle>
        <Carousel opts={{ align: "start" }} className="max-2xl:w-[90%] w-full mx-auto">
          <CarouselPrevious />
          <CarouselNext />
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.id || index} className="md:basis-1/2 lg:basis-1/3">
                <div className="sm:break-inside-avoid">
                  <blockquote className="rounded-lg bg-gray-50 p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-4">
                      <img
                        alt="User Avatar"
                        src={`https://i.pravatar.cc/56?u=${testimonial.user.id}`}
                        width="56"
                        height="56"
                        className="size-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="mt-0.5 text-lg font-medium text-gray-900">
                          {testimonial.user.first_name} {testimonial.user.last_name}
                        </p>
                        <div className="flex justify-center gap-0.5 text-yellow-600">
                          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700">{testimonial.content}</p>
                  </blockquote>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
