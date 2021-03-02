/*STORED PROCEDURES ORDER MATCHES THE ORDER IN react > services > userProfileService.js*/

/* 1: GET All User Profiles */
/* 2: GET User Profiles by ID */
/* 3: GET Search User Profiles */
/* 4: POST Add User Profile */
/* 5: PUT Update User Profile by ID */
/* 6: PUT Activate User Profile Status by ID */
/* 7: DELETE User Profile by ID */

/* 1: GET All User Profiles */

ALTER PROC [dbo].[UserProfiles_SelectAll]
			@PageIndex int,
			@PageSize int

AS

	/*
		DECLARE
			@_pageIndex int = 0
			,@_pageSize int = 100

		EXECUTE [dbo].[UserProfiles_SelectAll]
			@_pageIndex
			,@_pageSize
	*/

BEGIN

	DECLARE @Offset int = @PageIndex * @PageSize

	SELECT		UP.[Id]
				,[UserId]
				,[FirstName]
				,[LastName]
				,[Mi]
				,[AvatarUrl]
				,[DateCreated]
				,[DateModified]
				, UserStatusId
				, UT.[Name] as UserStatus
				, TotalCount = COUNT(1) OVER()
	FROM		[dbo].[UserProfiles] as UP
	join dbo.Users as U on U.Id = UP.UserId
	join dbo.UserStatus as UT on UT.Id = U.UserStatusId
	WHERE UP.UserId > 1
	ORDER BY	[Id]

	OFFSET @Offset ROWS
	FETCH NEXT @PageSize ROWS ONLY
	
END

/* 2: GET User Profiles by ID */

ALTER PROC [dbo].[UserProfiles_Select_ById]
			@Id int

AS

	/*
		DECLARE @_Id INT = 57;
		EXECUTE [dbo].[UserProfiles_Select_ById] @_Id
	*/

BEGIN

	SELECT	 [UserId] as Id
			,[UserId]
			,[FirstName]
			,[LastName]
			,[Mi]
			,[AvatarUrl]
			,[DateCreated]
			,[DateModified]
			, UserStatusId
			, UT.[Name] as UserStatus
	FROM		[dbo].[UserProfiles] as UP
	join dbo.Users as U on U.Id = UP.UserId
	join dbo.UserStatus as UT on UT.Id = U.UserStatusId
	WHERE	[UserId] = @Id

END

/* 3: GET Search User Profiles */

ALTER PROC [dbo].[UserProfiles_Search]
			@pageIndex INT
			, @pageSize INT
			, @searchString NVARCHAR(100)
AS

/*

EXECUTE dbo.UserProfiles_Search @pageIndex = 0, @pageSize = 6, @searchString = 'Angel'


*/

BEGIN

SELECT [Id]
      ,[UserId]
      ,[FirstName]
      ,[LastName]
      ,[Mi]
      ,[AvatarUrl]
      ,[DateCreated]
      ,[DateModified]
	  , [Total Rows] = COUNT(1) OVER()
  FROM [dbo].[UserProfiles]
  WHERE (FirstName LIKE '%' + @searchString + '%'
  OR LastName LIKE '%' + @searchString + '%')
  AND UserId > 1

  ORDER BY Id
  OFFSET (@pageIndex) * @pageSize ROWS
  FETCH NEXT @pageSize ROWS ONLY

END

/* 4: POST Add User Profile */

ALTER proc [dbo].[UserPhones_Insert]

			 @UserId int OUTPUT 
			,@Phone nvarchar(20)
			,@isPrimary bit
			
As

/* -------- Test Code --------
    Declare @UserId int = 5
    Declare @Phone nvarchar(20) = '111-256-2682'
           ,@isPrimary bit = 1
    
    Execute dbo.UserPhones_Insert
                             @UserId 
                            ,@Phone
                            ,@isPrimary
   
	
	Select *
    From dbo.UserPhones
*/


BEGIN
INSERT INTO [dbo].[UserPhones]
           ([UserId]
		   ,[Phone]
           ,[isPrimary])

	   VALUES
			(@UserId
			,@Phone
			,@isPrimary)	

END

/* 5: PUT Update User Profile by ID */

ALTER PROC [dbo].[UserProfiles_Update]
			@UserId int
			,@FirstName nvarchar(100)
			,@LastName nvarchar(100)
			,@Mi nvarchar(2)
			,@AvatarUrl varchar(255)
			,@Id int 

AS

	/*
		-- EXECUTE [dbo].[UserProfiles_SelectAll] 0, 100

		DECLARE 
			@_UserId int = 5
			,@_FirstName nvarchar(100) = 'First'
			,@_LastName nvarchar(100) = 'Last'
			,@_Mi nvarchar(2) = 'MI'
			,@_AvatarUrl varchar(255) = 'http://fakeUrl.img'
			,@_Id int = 6

		EXECUTE [dbo].[UserProfiles_Select_ById]
			@_Id

		EXECUTE [dbo].[UserProfiles_Update]
			@_UserId
			,@_FirstName
			,@_LastName
			,@_Mi
			,@_AvatarUrl
			,@_Id

		EXECUTE [dbo].[UserProfiles_Select_ById]
			@_Id
	*/
BEGIN
	DECLARE @DateNow datetime2(7) = GETUTCDATE()

	UPDATE	[dbo].[UserProfiles]
	SET	
			[FirstName] = @FirstName
			,[LastName] = @LastName
			,[Mi] = @Mi
			,[AvatarUrl] = @AvatarUrl
			,[DateModified] = @DateNow
	WHERE	[UserId] = @UserId

END

/* 6: PUT Activate User Profile Status by ID */

ALTER proc [dbo].[UserProfiles_UpdateStatus]

			 @Id int
			,@UserStatusId int

as
/*---- TEST CODE ----

	DECLARE @Id int = 1
			,@UserStatusId int = 1

	Select * 
	From dbo.UserProfiles
	Where Id = @Id

	EXECUTE dbo.UserProfiles_UpdateStatus @Id,
								   @UserStatusId

	Select * 
	From dbo.UserProfiles
	Where Id = @Id

*/
BEGIN

	UPDATE [dbo].[Users]
	   SET [UserStatusId] = @UserStatusId
	   WHERE Id = @Id

END

/* 7: DELETE User Profile by ID */

ALTER PROC [dbo].[UserProfiles_Delete]
			@Id int 

AS
/*
	DECLARE 
		@_Id int = 13

	EXECUTE [dbo].[UserProfiles_Select_ById]
		@_Id

	EXECUTE [dbo].[UserProfiles_Delete]
		@_Id

	EXECUTE [dbo].[UserProfiles_SelectAll] 0, 100
*/
BEGIN

	DELETE FROM	[dbo].[UserProfiles]
	WHERE	[Id] = @Id

END