module Level5.Level5Init exposing (init)

{-| Init of Level5 Model.


# init

@docs init

-}

import Array
import Browser.Dom exposing (getViewport)
import GlobalFunction.GlobalBasics as GlobalBasics
import GlobalFunction.GlobalModule as GlobalModule
import Level5.Level5Type as Level5Type
import MainFunction.MainType as MainType
import Modules.Boundary as Boundary
import Modules.Brick as Brick exposing (Brick)
import Modules.EndPoint as EndPoint
import Modules.Event as Event exposing (Event, hitBlock)
import Modules.GameControl as GameControl
import Modules.Needle as Needle
import Modules.NoticeBoard as NoticeBoard
import Modules.Player as Player exposing (Player)
import Modules.SavePoint as SavePoint
import Task


{-| `init` of Level5 \`Model
-}
init : () -> ( Level5Type.Model, Cmd MainType.Msg )
init a =
    let
        tempProperty =
            Player.defPlayerProperty

        newProperty =
            { tempProperty
                | playerJumpNum = 999999
                , ifPlayerJumpOnTheGround = False
            }
        newnewProperty =
          {newProperty | isGreen = True}
        newModel =
            { windowBoundary = ( 1000.0, 800.0 )
            , levelBoundary = ( 70 * 40, 40 * 40.0 )
            , actEvent = Array.fromList []
            , event =
                Array.fromList
                    [ Event.hitBlockAfter 1 "wings" ( 3, 36 ) ( 1, 1 ) 3
                    , Event.hitLineSeg 2 "first needle" (GlobalBasics.blockPosFloat ( 5, 39.9 )) (GlobalBasics.blockPosFloat ( 47, 39.9 ))
                    , Event.hitLineSeg 3 "first ?" (GlobalBasics.blockPosFloat ( 3.05, 38.01 )) (GlobalBasics.blockPosFloat ( 3.95, 38.01 ))
                    , Event.hitLineSeg 4 "second ?" (GlobalBasics.blockPosFloat ( 56.05, 38.01 )) (GlobalBasics.blockPosFloat ( 56.95, 38.01 ))
                    , Event.hitLineSeg 5 "third ?" (GlobalBasics.blockPosFloat ( 58.05, 38.01 )) (GlobalBasics.blockPosFloat ( 58.95, 38.01 ))
                    , Event.hitBlockAfter 6 "get blue" ( 56, 36 ) ( 1, 1 ) 4
                    , Event.hitBlockAfter 7 "get red" ( 58, 36 ) ( 1, 1 ) 5
                    , Event.hitLineSegAfter 8 "hit red then blue" (GlobalBasics.blockPosFloat ( 56.05, 38.01 )) (GlobalBasics.blockPosFloat ( 56.95, 38.01 )) 5
                    , Event.hitLineSegAfter 8 "hit blue then red" (GlobalBasics.blockPosFloat ( 58.05, 38.01 )) (GlobalBasics.blockPosFloat ( 58.95, 38.01 )) 4
                    , Event.hitLineSegAfter 9 "hit blue then land" (GlobalBasics.blockPosFloat ( 1, 39.9 )) (GlobalBasics.blockPosFloat ( 70, 39.9 )) 4
                    , Event.hitLineSegAfter 10 "hit red then land" (GlobalBasics.blockPosFloat ( 1, 39.9 )) (GlobalBasics.blockPosFloat ( 70, 39.9 )) 5
                    , Event.hitLineSegAfter 11 "second ? again" (GlobalBasics.blockPosFloat ( 56.05, 38.01 )) (GlobalBasics.blockPosFloat ( 56.95, 38.01 )) 9
                    , Event.hitLineSegAfter 12 "third ? again" (GlobalBasics.blockPosFloat ( 58.05, 38.01 )) (GlobalBasics.blockPosFloat ( 58.95, 38.01 )) 10
                    , Event.hitLineSegAfter 13 "hit again red then blue" (GlobalBasics.blockPosFloat ( 56.05, 38.01 )) (GlobalBasics.blockPosFloat ( 56.95, 38.01 )) 12
                    , Event.hitLineSegAfter 13 "hit again blue then red" (GlobalBasics.blockPosFloat ( 58.05, 38.01 )) (GlobalBasics.blockPosFloat ( 58.95, 38.01 )) 11
                    , Event.init { id = 14, name = "blue-red mix" }
                        (Event.AfterActEvent 13)
                        (Event.TimeAfterStart 100)
                        (Event.quickDuration 10)
                    , Event.hitBlockAfter 15 "get green" ( 66, 39 ) ( 1, 1 ) 14
                    , Event.hitLineSeg 16 "second needle" (GlobalBasics.blockPosFloat ( 53, 11 )) (GlobalBasics.blockPosFloat ( 63, 11 ))
                    , Event.hitLineSeg 17 "jump down" (GlobalBasics.blockPosFloat ( 6, 11.1 )) (GlobalBasics.blockPosFloat ( 12, 11.1 ))
                    ]
            , boundary = Boundary.normalInit
            , playerAtLastSavePoint = Player.init ( 50, 290.0 ) Player.defPlayerProperty (Player.ChangeTo newProperty 1 (Player.ChangeTo newnewProperty 15 Player.NoNextPropertyChange))
            , player =
                Player.init ( 50, 290.0 ) Player.defPlayerProperty (Player.ChangeTo newProperty 1 (Player.ChangeTo newnewProperty 15 Player.NoNextPropertyChange))
            , bricks =
                Array.fromList
                    (List.concat
                        [ Brick.initRow 10 1 5
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 13, 10 )) ( 40 * 40, 10 * 40 ) "#00000050" ]
                        , Brick.initRow 40 1 70
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 3, 37 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 3, 36 ))
                                (Brick.Wings)
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 3 (GlobalModule.InvisibleAfterEvent 1 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , [ NoticeBoard.boundary ( 6, 2 ) ( 6, 4 ) ]
                        , let
                            tempBoard1 =
                                NoticeBoard.boundary ( 5.8, 32 ) ( 6.2, 2.2 )
                          in
                          [ { tempBoard1 | visibility = GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 2 GlobalModule.NoNextVisibility) } ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 56, 37 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.initPosVolumeColor (GlobalBasics.blockPosFloat ( 58, 37 )) ( 40, 40 ) "#FFFF00" ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 56, 36 ))
                                (Brick.Pill "#1E90FF")
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 4 (GlobalModule.InvisibleAfterEvent 6 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                (GlobalModule.Move (Array.fromList []) 5.0 11 (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 66, 39 ) ]) 5.0 -1 GlobalModule.NoNextMove))
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 58, 36 ))
                                (Brick.Pill "#FF0000")
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 5 (GlobalModule.InvisibleAfterEvent 7 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                (GlobalModule.Move (Array.fromList []) 5.0 12 (GlobalModule.Move (Array.fromList [ GlobalBasics.blockPosFloat ( 66, 39 ) ]) 5.0 -1 GlobalModule.NoNextMove))
                          ]
                        , [ Brick.init
                                (GlobalBasics.blockPosFloat ( 66, 39 ))
                                (Brick.Pill "\t#3CB371")
                                (GlobalModule.Invisible (GlobalModule.VisibleAfterEvent 14 (GlobalModule.InvisibleAfterEvent 15 GlobalModule.NoNextVisibility)))
                                (GlobalModule.NoCollide GlobalModule.NoNextCollision)
                                GlobalModule.NoNextMove
                          ]
                        , Brick.initRow 10 63 70
                        , Brick.initRow 11 63 70
                        ]
                    )
            , savePoints =
                Array.fromList
                    [ SavePoint.init (GlobalBasics.blockPos ( 2, 9 ))
                    , SavePoint.init (GlobalBasics.blockPos ( 53, 39 ))
                    ]
            , endPoint = EndPoint.init (GlobalBasics.blockPos ( 69, 9 ))
            , noticeBoards =
                Array.fromList
                    [ NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 3.5, 37.8 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 9, 3.8 )) "Do not" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 9, 4.8 )) "jump down" 40
                    , let
                        tempNotice1 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 9, 33.2 )) "As I said ^_^" 40
                      in
                      { tempNotice1 | noticeBoardVisibility = NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 2 "As I said ^_^" NoticeBoard.NoNextNoticeBoardVisibility) }
                    , let
                        tempNotice2 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 5, 33 )) "" 40
                      in
                      { tempNotice2 | noticeBoardVisibility = NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 1 "If I were a bird..." NoticeBoard.NoNextNoticeBoardVisibility) }
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 56.5, 37.8 )) "?" 40
                    , NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 58.5, 37.8 )) "?" 40
                    , let
                        tempNotice3 =
                            NoticeBoard.quickInit (GlobalBasics.blockPosFloat ( 58, 33 )) "" 40
                      in
                      { tempNotice3 | noticeBoardVisibility = NoticeBoard.Invisible (NoticeBoard.VisibleAfterEvent 8 "Blue Pill or Red Pill?" (NoticeBoard.VisibleAfterEvent 15 "Green protects you" NoticeBoard.NoNextNoticeBoardVisibility)) }
                    ]
            , needles =
                Array.fromList
                    (List.concat
                        [ List.map (\i -> Needle.initHiddenCollideAfter ( i, 10 ) 17 Needle.Laser) (List.range 6 12)
                        , Needle.initHiddenRow 39.9 5 46 2 Needle.Upwards
                        , [ Needle.deadlyBlock ( 20, 20 ) ( 2, 8 ) 
                          , Needle.deadlyBlock ( 20, 32 ) ( 2, 8 ) 
                          ]
                        , [ Needle.deadlyBlock ( 26, 20 ) ( 2, 4 ) 
                          , Needle.deadlyBlock ( 26, 28 ) ( 2, 12 ) 
                          ]
                        , [ Needle.deadlyBlock ( 32, 20 ) ( 2, 6 )
                          , Needle.deadlyBlock ( 32, 30 ) ( 2, 10 )
                          ]
                        , [ Needle.deadlyBlock ( 38, 20 ) ( 2, 8 )
                          , Needle.deadlyBlock ( 38, 32 ) ( 2, 8 )
                          ]
                        , [ Needle.deadlyBlock ( 44, 20 ) ( 2, 10 )
                          , Needle.deadlyBlock ( 44, 34 ) ( 2, 6 )
                          ]
                        -- , let
                        --     tempNeedle =
                        --         Needle.sword ( 53, 1 ) ( 53, 50 ) ( 10, 0.25 ) 10.0 16 
                        --   in
                        --   [ { tempNeedle
                        --         | visibility = GlobalModule.Visible GlobalModule.NoNextVisibility
                        --         , collision = GlobalModule.Collide (GlobalModule.NoCollideAfterEvent 15 GlobalModule.NoNextCollision)
                        --     }
                        --   ]
                        , List.map (\i -> Needle.initPos (GlobalBasics.blockPos (i,11)) Needle.Laser) (List.range 53 62) 
                        ]
                    )
            , keyPressed = []
            , gameControl = GameControl.init MainType.Level6 [["Hit the first\"?\"","to get the wings"],["Hit the last two \"?\" again","to mix blue with red"]]
            , mainScene = MainType.Level5
            , number = []
            }
    in
    ( newModel, Task.perform MainType.GetViewport getViewport )
