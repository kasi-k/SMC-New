import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="bg-white text-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 h-screen  mt-24">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-8 text-7xl tracking-tight font-extrabold text-red-700 lg:text-9xl  ">
            404
          </h1>
          <p className="mb-5 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl ">
            Something's missing.
          </p>
          <p className="mb-2 text-lg font-light text-gray-500 ">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <Link
            to={"/dashboard"}
            className="inline-flex text-green-700   font-medium rounded-lg text-lg px-5 py-2.5 text-center  my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;