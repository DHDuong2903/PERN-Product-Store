import { CircleUserRoundIcon } from "lucide-react";

function UserSetting() {
  return (
    <div className="dropdown dropdown-end">
      {/* Dropdown trigger */}
      <button tabIndex={0} className="btn btn-ghost btn-circle">
        <CircleUserRoundIcon className="size-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl w-56 border border-base-content/10"
      >
        <ul className="menu p-2">
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserSetting;
