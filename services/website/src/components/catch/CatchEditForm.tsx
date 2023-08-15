import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PlaceInput } from "../common/PlaceInput";
import { Catch } from "./models";
import Button from "../common/Button";
import InputField from "../common/InputField";
import DateTimeInputField from "../common/DateTimeInputField";
import Selection from "../common/Selection";

type CatchEditFormProps = {
  data: Catch;
  onSubmit: (value: Partial<Catch>) => void;
};

export const CatchEditForm = ({ data, onSubmit }: CatchEditFormProps) => {
  const formik = useFormik({
    initialValues: {
      catched_at: data.catched_at as string | null | undefined,
      place: data.place as
        | {
            latitude: number;
            longitude: number;
          }
        | null
        | undefined,
      fishes_species: data.fishes.map((fish) => fish.species),
      fishes_size_text: data.fishes.map((fish) => fish.size_text || ""),
      fishes_count: data.fishes.map((fish) => fish.count),
      method_type: data.method.type,
      method_details: data.method.details || "",
    },
    validationSchema: Yup.object({
      catched_at: Yup.string()
        .matches(
          /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}(:[0-9]{2}(.[0-9]+)?)?Z$/,
          "日付の形式が間違っています。",
        )
        .nullable()
        .test("null-check", "不正な値です。", (value) => value !== null)
        .required("必ず入力してください。"),
      fishes_species: Yup.array()
        .of(Yup.string().required("必ず入力してください。"))
        .min(1, "Must be less than 1")
        .required("必ず入力してください。"),
      method_type: Yup.string().required("必ず入力してください。"),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...data,
        id: data.id,
        catched_at: values.catched_at!,
        place: values.place,
        fishes: values.fishes_species
          .filter((value) => !!value)
          .map((value, i) => ({
            species: value,
            size_text: values.fishes_size_text[i] || undefined,
            count: Number(values.fishes_count[i] || undefined),
          })),
        method: {
          type: values.method_type,
          details: !values.method_details ? undefined : values.method_details,
        },
      } as Catch);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="my-3 grid grid-cols-1 sm:grid-cols-7">
        <DateTimeInputField
          label="日時"
          name="catched_at"
          className="sm:col-span-5 md:col-span-4 lg:col-span-3"
          value={formik.values.catched_at?.toString() || ""}
          onChange={(e) => {
            formik.setValues({
              ...formik.values,
              catched_at: e.target.value,
            });
          }}
          error={
            formik.touched.catched_at ? formik.errors.catched_at : undefined
          }
        />
      </div>
      <div className="my-4">
        <PlaceInput
          value={formik.values.place}
          onChange={(value) => {
            formik.setValues({ ...formik.values, place: value });
          }}
        />
      </div>
      <div className="my-4">
        <InputField
          label="魚種"
          name="fishes_species[0]"
          placeholder="例) オオモンハタ"
          type="text"
          value={formik.values.fishes_species[0]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.fishes_species && formik.errors.fishes_species
              ? formik.errors.fishes_species[0]
              : undefined
          }
        />
      </div>
      <div className="my-4">
        <InputField
          label="サイズ"
          name="fishes_size_text[0]"
          placeholder="例) 50cm"
          type="text"
          value={formik.values.fishes_size_text[0]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.fishes_size_text}
        />
      </div>
      <div className="my-4">
        <Selection
          type="toggle-button"
          label="仕掛け"
          name="method_type"
          options={["徒手", "刺突", "網", "釣", "その他"].map((item) => {
            return { value: item, label: item };
          })}
          value={formik.values.method_type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.method_type ? formik.errors.method_type : undefined
          }
        />
      </div>
      <div className="my-4">
        <InputField
          label="備考"
          name="method_details"
          placeholder="仕掛けの詳細を記載"
          type="text"
          value={formik.values.method_details}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.method_details
              ? formik.errors.method_details
              : undefined
          }
        />
      </div>
      <div className="my-4">
        <Button type="submit" color="primary">
          登録
        </Button>
      </div>
    </form>
  );
};

const CatchEditFormWithState = function ({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: (value: Catch) => void;
}) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/catches/${id}`, {
        method: "GET",
      });
      if (result.ok) {
        setData(await result.json());
      }
    })();
  }, [id]);
  if (data) {
    return (
      <CatchEditForm
        data={data}
        onSubmit={async (value) => {
          try {
            const result = await fetch(`/api/catches/${id}`, {
              method: "PUT",
              body: JSON.stringify(value),
            });
            if (result.ok) {
              onSuccess(await result.json());
            } else {
              alert("登録できませんでした。");
            }
          } catch (e) {
            alert(e);
          }
        }}
      />
    );
  }
  return <div>Loading...</div>;
};

export default CatchEditFormWithState;
