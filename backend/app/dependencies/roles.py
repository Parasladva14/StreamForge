from fastapi import Depends, HTTPException, status

from app.dependencies.auth import get_current_user


def require_role(*allowed_roles):
    """
    Allow access only to users with one of the allowed roles.
    """

    def role_checker(current_user=Depends(get_current_user)):

        if current_user.role not in allowed_roles:

            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )

        return current_user

    return role_checker