import { Label } from "../../../components/ui/Label";
import { Map, TriangleAlert, Users } from "lucide-react";
import Counter from "../../../components/ui/Counter";
import { useState } from "react";
import ConditionSelector from "../../../components/ui/ConditionSelector";
import { Input } from "../../../components/ui/Input";

export const FormSOS = () => {
  const [count, setCount] = useState(1);
    const [selected, setSelected] = useState<string[]>([]);
     const handleToggle = (value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };
      const options = ["Bị thương", "Mắc kẹt", "Có người già/trẻ em/mang thai", "Bình thường"];
  return (
  <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border p-4 sm:p-6 lg:p-8">
  <form className="space-y-8">
    <h2 className="text-center text-red-600 text-xl sm:text-2xl lg:text-3xl font-bold">
      CỨU HỘ KHẨN CẤP
    </h2>

    {/* Vị trí */}
    <section className="space-y-3">
      <Label
        icon={Map}
        className="text-red-600 font-semibold text-lg"
      >
        Vị trí
      </Label>

      <div className="h-56 border rounded-xl bg-slate-100 flex items-center justify-center">
        Bản đồ
      </div>
    </section>

    {/* Số người */}
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="text-red-600" />
        <p className="text-red-600 font-semibold">
          Số người cần cứu
        </p>
      </div>

      <Counter
        value={count}
        onDecrease={() =>
          setCount((prev) => Math.max(1, prev - 1))
        }
        onIncrease={() =>
          setCount((prev) => prev + 1)
        }
      />
    </section>

    {/* Tình trạng */}
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <TriangleAlert className="text-red-600" />
        <p className="text-red-600 font-semibold">
          Tình trạng
        </p>
      </div>

      <ConditionSelector
        options={options}
        values={selected}
        onToggle={handleToggle}
      />
    </section>

    {/* SĐT */}
    <section className="space-y-3">
      <Label
        className="text-red-600 font-semibold"
      >
        📞 Số điện thoại
      </Label>

      <Input
      value=""
        placeholder="Nhập số điện thoại liên hệ"
        className="w-full"
      />
    </section>

    {/* Mô tả */}
    <section className="space-y-3">
      <Label className="text-red-600 font-semibold">
        📝 Mô tả tình trạng
      </Label>

      <textarea
        className="w-full border rounded-xl p-3 min-h-32 resize-none"
        placeholder="Mô tả tình trạng hiện tại..."
      />
    </section>

    {/* Submit */}
    <button
      type="submit"
      className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:opacity-90"
    >
      GỬI SOS
    </button>
  </form>
</div>
  );
};