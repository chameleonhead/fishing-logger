import { useNavigate, useSearchParams } from "react-router-dom";
import CatchCreateForm from "../../components/catch/CatchCreateForm";
import PageHeader from "../../components/common/PageHeader";
import { useMemo } from "react";
import { Instant } from "@js-joda/core";

export const CreatePage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const initialValues = useMemo(() => {
    const catched_at = (() => {
      const value = params.get("catched_at");
      if (!value) {
        return null;
      }
      try {
        return Instant.parse(value).toString();
      } catch (e) {
        return null;
      }
    })();
    const place = (() => {
      const place_latitude = params.get("place_latitude");
      const place_longitude = params.get("place_longitude");
      if (!place_latitude || !place_longitude) {
        return null;
      }
      const number_latitude = Number(place_latitude);
      const number_longitude = Number(place_longitude);
      if (isNaN(number_latitude) || isNaN(number_longitude)) {
        return null;
      }
      if (number_latitude < -90 || number_latitude > 90) {
        return null;
      }
      if (number_longitude < -180 || number_longitude > 180) {
        return null;
      }
      return { latitude: number_latitude, longitude: number_longitude };
    })();
    return {
      catched_at,
      place,
    };
  }, [params]);
  return (
    <div>
      <PageHeader title="漁獲登録" />
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <CatchCreateForm
            initialValues={{
              catched_at: initialValues.catched_at || undefined,
              place: initialValues.place || undefined,
            }}
            onSuccess={(value) => navigate(`/catches/${value.id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default CreatePage;
