import { useMemo, useState } from "react";

export default function useFeedFilters(entries) {
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");

  const handleResetFilters = () => {
    setCompanyFilter("");
    setJobTypeFilter("");
    setSortOrder("newest");
    setSearchTerm("");
  };

  const uniqueCompanies = useMemo(() => {
    return [...new Set(entries.map((entry) => entry.company_name))];
  }, [entries]);

  const filteredAndSortedEntries = useMemo(() => {
    return [...entries]
      .filter((entry) => {
        const matchesCompany =
          companyFilter === "" || entry.company_name === companyFilter;

        const matchesJobType =
          jobTypeFilter === "" || entry.job_type === jobTypeFilter;

        const normalizedSearch = searchTerm.trim().toLowerCase();

        const matchesSearch =
          normalizedSearch === "" ||
          entry.company_name?.toLowerCase().includes(normalizedSearch) ||
          entry.role?.toLowerCase().includes(normalizedSearch) ||
          entry.summary?.toLowerCase().includes(normalizedSearch) ||
          entry.location?.toLowerCase().includes(normalizedSearch);

        return matchesCompany && matchesJobType && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.layoff_date);
        const dateB = new Date(b.layoff_date);

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [entries, companyFilter, jobTypeFilter, sortOrder, searchTerm]);

  return {
    companyFilter,
    setCompanyFilter,
    jobTypeFilter,
    setJobTypeFilter,
    sortOrder,
    setSortOrder,
    searchTerm,
    setSearchTerm,
    handleResetFilters,
    uniqueCompanies,
    filteredAndSortedEntries,
  };
}