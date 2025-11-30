"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ProductForm({ mode, initial, categories, onSubmit }) {
  const [form, setForm] = useState(initial);

  // Sync when initial changes (important for Edit page)
  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files || []);
    setForm((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const removeExistingImage = (imageId) => {
    if (initial.onDeleteImage) initial.onDeleteImage(imageId);
  };

  const removeNewImage = (idx) => {
    setForm((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== idx),
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg border mt-6">
      <h2 className="text-2xl font-bold mb-4">
        {mode === "add" ? "Add Product" : "Edit Product"}
      </h2>

      <form
        className="space-y-4"
        onSubmit={submit}
        method="POST"
        encType="multipart/form-data"
      >
        {/* NAME */}
        <div>
          <Label>Product Name</Label>
          <Input name="name" value={form.name} onChange={handleChange} required />
        </div>

        {/* DESCRIPTION */}
        <div>
          <Label>Description</Label>
          <textarea
            name="description"
            rows={3}
            className="w-full border p-2 rounded"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <Label>Price</Label>
          <Input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* STOCK */}
        <div>
          <Label>Stock</Label>
          <Input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        {/* CATEGORY */}
        <div>
          <Label>Category</Label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}

            <option value="custom">Other (Custom)</option>
          </select>
        </div>

        {/* CUSTOM CATEGORY */}
        {form.categoryId === "custom" && (
          <div>
            <Label>Custom Category Name</Label>
            <Input
              name="customCategoryName"
              value={form.customCategoryName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* EXISTING IMAGES (Only when editing) */}
        {mode === "edit" &&
          Array.isArray(form.existingImages) &&
          form.existingImages.length > 0 && (
            <div>
              <Label>Existing Images</Label>
              <div className="flex gap-3 flex-wrap mt-2">
                {form.existingImages.map((img, i) => (
                  <div key={i} className="relative border rounded p-1">
                    <Image
                      src={img.url}
                      width={90}
                      height={90}
                      className="rounded object-cover"
                      alt="existing"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => removeExistingImage(img.imageId)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* NEW IMAGES */}
        <div>
          <Label>Upload Images</Label>
          <Input type="file" multiple onChange={handleNewImages} />

          {form.newImages.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-2">
              {form.newImages.map((file, i) => (
                <div key={i} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    width={90}
                    height={90}
                    className="border rounded object-cover"
                    alt="preview"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0"
                    onClick={() => removeNewImage(i)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <Button type="submit" className="w-full">
          {mode === "add" ? "Create Product" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
