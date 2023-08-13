import { useFormik } from "formik";
import * as Yup from "yup";
import { Ship } from "./models";
import Button from "../common/Button";
import InputField from "../common/InputField";

type ShipCreateFormProps = {
  onSubmit: (value: Ship) => void;
};

export const ShipCreateForm = ({ onSubmit }: ShipCreateFormProps) => {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("必ず入力してください。"),
    }),
    onSubmit: (values) => {
      onSubmit({
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
          error={formik.touched.name ? formik.errors.name : undefined}
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

const ShipCreateFormWithState = function ({
  onSuccess,
}: {
  onSuccess: (value: Ship) => void;
}) {
  return (
    <ShipCreateForm
      onSubmit={async (value) => {
        try {
          const result = await fetch("/api/ships", {
            method: "POST",
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
};

export default ShipCreateFormWithState;
