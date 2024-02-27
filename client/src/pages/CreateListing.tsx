import CreateListingForm from "../features/CreateListing";

const CreateListing = () => {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <CreateListingForm />
    </main>
  );
};

export default CreateListing;
