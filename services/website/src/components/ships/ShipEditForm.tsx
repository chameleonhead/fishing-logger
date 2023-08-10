import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
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
    <Form onSubmit={formik.handleSubmit}>
      <FormGroup>
        <Label for="name">名前</Label>
        <Input
          id="name"
          name="name"
          placeholder="例) クイーンエリザベス"
          type="text"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </FormGroup>
      <Button type="submit" color="primary" block>
        登録
      </Button>
    </Form>
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
