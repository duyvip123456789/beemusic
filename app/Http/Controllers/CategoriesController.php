<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Models\Music_cate;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use DB;
use Illuminate\Pagination\Paginator;
use Inertia\Inertia;
class CategoriesController extends Controller
{
    // hiển thị danh sách danh mục
    public function ListCate()
    {
        $categories = Categories::orderBy('created_at', 'desc')->get();
        return Inertia::render('Admin/categories/ListCategories', ['categories' => $categories]);
    }

    // lưu lại dữ liệu thêm
    public function AddCate(Request $request)
    {
        $categories = new Categories;
        $categories->name = $request->input('name');
        // Kiểm tra xem có tệp tin ảnh được tải lên không
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            // Đảm bảo rằng thư mục public/upload/images đã tồn tại, nếu không thì tạo mới
            $path = public_path('upload/images');
            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            // Lưu ảnh vào thư mục public/upload/images
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('upload/images'), $fileName);
            // Lấy đường dẫn của ảnh
            $avatar = $fileName;
            // Lưu đường dẫn vào cơ sở dữ liệu
            $categories->avatar = $avatar;
        }
        $categories->save();

        return redirect('/categories/list');
    }


    //cập nhật Danh mục
    public function Update($id)
    {
        $categories = Categories::find($id);
        return Inertia::render('Admin/categories/EditCate', ['categories' => $categories]);
    }

    public function UpdateCate(Request $request, $id)
    {
        // Tìm tin tức theo $id
        $categories = Categories::find($id);
        // Cập nhật các trường
        $categories->name = $request->input('name');
        // Lưu thông tin tin tức đã cập nhật vào cơ sở dữ liệu
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = public_path('upload/images');

            if (!file_exists($path)) {
                mkdir($path, 0777, true);
            }
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->move($path, $fileName);
            $avatar = $fileName;
            $categories->avatar = $avatar;
        } else { // Thêm phần xử lý khi không có ảnh mới
            $categories->avatar = $categories->avatar; // Giữ nguyên ảnh cũ
        }
        $categories->save();

        return redirect('/categories/list');
    }

    //xóa danh mục
    public function Delete($id)
    {
        $categories = Categories::find($id);
        Music_cate::where('id_categories', $categories->id)->delete();
        $categories->delete();
        return redirect('/categories/list');
    }
}
