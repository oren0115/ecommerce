import React, { useState, useEffect } from "react";
import { PromotionalSlide, CreatePromotionalSlideData } from "../../../types";
import { promotionalCarouselAPI } from "../../../api/api";
import PromotionalCarouselList from "./PromotionalCarouselList";
import PromotionalCarouselForm from "./PromotionalCarouselForm";
import PromotionalCarouselSearch from "./PromotionalCarouselSearch";
import PromotionalCarouselStats from "./PromotionalCarouselStats";
// import "../../../styles/promotionalCarouselManagement.css";

const PromotionalCarouselManagement: React.FC = () => {
  const [slides, setSlides] = useState<PromotionalSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState<PromotionalSlide | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch slides on component mount
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, selectedStatus]);

  // Add a separate effect to refresh data when needed
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch slides with filters
      const params: any = {
        page: currentPage.toString(),
        limit: "10",
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedStatus) params.status = selectedStatus;

      const response = await promotionalCarouselAPI.getAll(params);

      // Handle the correct response structure from backend
      const slidesData = (response.data as any)?.data?.items || [];
      const totalCount = (response.data as any)?.data?.pagination?.total || 0;

      // Ensure we have an array of slides
      setSlides(Array.isArray(slidesData) ? slidesData : []);
      setTotalPages(Math.ceil(totalCount / 10));
    } catch (err: any) {
      console.error("Error fetching promotional slides:", err);
      setError(
        err.response?.data?.message || "Failed to fetch promotional slides"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    setEditingSlide(null);
    setShowForm(true);
  };

  const handleEditSlide = (slide: PromotionalSlide) => {
    setEditingSlide(slide);
    setShowForm(true);
  };

  const handleDeleteSlide = async (slideId: string) => {
    if (
      !window.confirm("Are you sure you want to delete this promotional slide?")
    ) {
      return;
    }

    try {
      await promotionalCarouselAPI.delete(slideId);
      setRefreshTrigger((prev) => prev + 1); // Refresh the list
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete promotional slide"
      );
    }
  };

  const handleFormSubmit = async (slideData: CreatePromotionalSlideData) => {
    try {
      if (editingSlide) {
        await promotionalCarouselAPI.update(editingSlide._id, slideData as any);
      } else {
        await promotionalCarouselAPI.create(slideData as any);
      }

      setShowForm(false);
      setEditingSlide(null);

      // Trigger refresh after successful save
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: any) {
      console.error("Error saving promotional slide:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      setError(
        err.response?.data?.message || "Failed to save promotional slide"
      );
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSlide(null);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "active":
        setSelectedStatus("active");
        setSearchTerm("");
        break;
      case "inactive":
        setSelectedStatus("inactive");
        setSearchTerm("");
        break;
      case "all":
        setSelectedStatus("");
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  // If form is shown, render the form page
  if (showForm) {
    return (
      <PromotionalCarouselForm
        slide={editingSlide}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  // Main management page
  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Promotional Carousel Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage promotional slides for the homepage carousel
            </p>
          </div>
          <button
            onClick={handleAddSlide}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Add New Slide
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="mb-8">
        <PromotionalCarouselStats slides={slides} />
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <PromotionalCarouselSearch
          onSearch={handleSearch}
          onStatusFilter={handleStatusFilter}
          selectedStatus={selectedStatus}
          onQuickAction={handleQuickAction}
        />
      </div>

      {/* Slides List */}
      <PromotionalCarouselList
        slides={slides}
        loading={loading}
        onEdit={handleEditSlide}
        onDelete={handleDeleteSlide}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default PromotionalCarouselManagement;
