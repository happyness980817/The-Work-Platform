import { Link, useOutletContext } from "react-router";
import { useTranslation } from "react-i18next";
import type { Route } from "./+types/facilitator-page-layout";
import type { AppContext } from "~/types";
import FacilitatorProfileCard from "~/features/users/components/facilitator-profile-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/common/components/ui/breadcrumb";
import ClFacilitatorPage from "~/features/platform/client/cl-facilitator-page";
import FaFacilitatorPage from "~/features/platform/facilitator/fa-facilitator-page";

const mockFacilitator = {
  id: 1,
  name: "Sarah Jenkins",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA213iE9y83Z7Qv8H2D0Gi5GBNmYEQcfoRkpQ1bqfhqGLDKZqjz6KHqZz7yKRquor_WoTtTDCViMRNK2BX24aWUd36Qess7S1Utxt1p3DInP4_Ewv7e3NiMWh0BtZDziWvjy5epxu1asuHrfPDnA4WFDAHC6FQ5oBrD1N1hjRDdLztzJ5QyIvvkbeY6CK5zqjxNLi47MeUpKN5ed14ZpA08VYoasoUiY4jtothvAo3DGeHLBsMTfjd2zbiQGr9v3HHg8KiYr6WfPV8",
  status: "online" as const,
  bio: "I help individuals untangle stressful thoughts using The Work. My sessions are direct, compassionate, and focused on finding your own truth.",
  languages: ["lang.ko", "lang.en"],
};

export default function FacilitatorPageLayout({
  params,
}: Route.ComponentProps) {
  const { t } = useTranslation();
  const { role } = useOutletContext<AppContext>();

  return (
    <div className="flex flex-col max-w-[1080px] mx-auto px-4 sm:px-8 py-8 gap-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/facilitators">{t("facilitators.title")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{mockFacilitator.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <FacilitatorProfileCard
            name={mockFacilitator.name}
            imageUrl={mockFacilitator.imageUrl}
            status={mockFacilitator.status}
            bio={mockFacilitator.bio}
            languages={mockFacilitator.languages}
          />
        </div>

        <div className="lg:col-span-8">
          {role === "client" ? <ClFacilitatorPage /> : <FaFacilitatorPage />}
        </div>
      </div>
    </div>
  );
}
