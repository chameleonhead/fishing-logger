import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { Ship } from "./models";

type ShipEditFormProps = {
  data: Ship;
  onSubmit: (value: Partial<Ship>) => void;
};

export const ShipEditForm = ({ data, onSubmit }: ShipEditFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: data.name || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("必ず入力してください。"),
    }),
    onSubmit: (values) => {
      onSubmit({
        ...data,
        id: data.id,
        name: values.name,
      } as Ship);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="my-4">
        <InputField
          label="船名"
          name="name"
          placeholder="例）クイーンエリザベス"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name
              ? formik.errors.name
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

const ShipEditFormWithState = function ({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: (value: Ship) => void;
}) {
  const [data, setData] = useState(undefined);
  useEffect(() => {
    (async () => {
      const result = await fetch(`/api/ships/${id}`, {
        method: "GET",
      });
      if (result.ok) {
        setData(await result.json());
      }
    })();
  }, [id]);
  if (data) {
    return (
      <ShipEditForm
        data={data}
        onSubmit={async (value) => {
          try {
            const result = await fetch(`/api/ships/${id}`, {
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

export default ShipEditFormWithState;
